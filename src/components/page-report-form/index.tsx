import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePickerElement } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToggle } from 'react-use';

import { TAccount, TAccountBalance, TCurrency, TExchangeRate, TReport } from '@/entites';
import { requiredCurrencies } from '@/settings';
import { actions, getAccountByIdMap, getReportByIdMap } from '@/store/buh';
import { evaluateForSure } from '@/utils/expression';
import { formatNumber } from '@/utils/format';

import * as S from './_styles';
import AccountsGroupedByCurrency from './accounts-gropped-by-currency';
import CurrenciesQuotes from './currency-quotes';
import AddAccountModal from './modal/modal-add-account';
import AddCurrencyModal from './modal/modal-add-currency';
import { getCurrenciesToShow, getCurrencyByAccountIdMap, getMostRecentReport } from './selector';
import { TForm, TFormAccountBalance, TFormExchangeRate, zForm } from './validation';

function buildFormExchangeRates(
    current: TFormExchangeRate[],
    balances: TFormAccountBalance[],
    currencyByAccountId: Map<TFormAccountBalance['accountId'], TCurrency>,
): TFormExchangeRate[] {
    const unqiueCurrencies = _.uniqBy(
        [
            ...requiredCurrencies,
            ...balances.reduce<TCurrency[]>((res, { accountId }) => {
                const currency = currencyByAccountId.get(accountId);
                if (currency) {
                    res.push(currency);
                }

                return res;
            }, []),
        ],
        (currency) => currency.id,
    );

    const formulaByCurrencyId = new Map(current.map((item) => [item.currencyId, item.formula]));

    return unqiueCurrencies.map(({ id: currencyId }) => ({
        currencyId,
        formula: formulaByCurrencyId.get(currencyId) ?? '',
    }));
}

const useDefaultValues = (
    currencyByAccountId: Map<TAccount['id'], TCurrency>,
    reportToEdit?: TReport,
    previousReport?: TReport,
): TForm =>
    useMemo(() => {
        const balances: TFormAccountBalance[] = (reportToEdit?.balances ?? previousReport?.balances ?? []).map(
            (accountBalance) => ({
                accountId: accountBalance.accountId,
                formula: reportToEdit ? formatNumber(accountBalance.balance) : '',
            }),
        );

        const exchangeRates = buildFormExchangeRates(
            (reportToEdit?.exchangeRates ?? []).map(({ currencyId, quote }) => ({
                currencyId,
                formula: formatNumber(quote),
            })),

            balances,
            currencyByAccountId,
        );

        return {
            balances,
            exchangeRates,
            createdAt: DateTime.fromISO(
                (reportToEdit?.createdAt ?? DateTime.now().toISO()) as string,
            ) as unknown as string,
        };
    }, [currencyByAccountId, reportToEdit, previousReport, buildFormExchangeRates, formatNumber]);

const sortBalances = (accounts: TFormAccountBalance[], accountById: Map<TAccount['id'], TAccount>) =>
    accounts.sort((a, b) => {
        const _a = accountById.get(a.accountId);
        const _b = accountById.get(b.accountId);

        if (!_a || !_b) return 0;

        return _a.title.localeCompare(_b.title);
    });

const ReportFormPage = () => {
    const [openNewAccountModal, toggleNewAccountModal] = useToggle(false);
    const [openNewCurrencyModal, toggleNewCurrencyModal] = useToggle(false);

    const reportById = useSelector(getReportByIdMap);
    const accountById = useSelector(getAccountByIdMap);
    const currencyByAccountId = useSelector(getCurrencyByAccountIdMap);

    const { reportId: reportToEditId } = useParams();
    const reportToEdit = reportToEditId ? reportById.get(reportToEditId) : undefined;

    const mostRecentReport = useSelector(getMostRecentReport);
    const defaultValues = useDefaultValues(currencyByAccountId, reportToEdit, mostRecentReport);

    const form = useForm<TForm>({
        defaultValues,
        resolver: zodResolver(zForm),
        mode: 'all',
    });

    const updateForm = (balances: TFormAccountBalance[]) => {
        form.setValue('balances', balances);

        form.setValue(
            'exchangeRates',
            buildFormExchangeRates(form.getValues('exchangeRates') ?? [], balances, currencyByAccountId),
        );
    };

    const handleAccountAdd = useCallback(
        (account: TAccount) => {
            const accountBalance = {
                accountId: account.id,
                formula: '',
            };

            const balances = form.getValues('balances') ?? [];
            balances.push(accountBalance);

            updateForm(sortBalances(balances, accountById));
        },
        [form, currencyByAccountId],
    );

    const handleAccountRemove = useCallback(
        (accountToRemove: TAccount) => {
            updateForm(
                (form.getValues('balances') ?? []).filter((balance) => balance.accountId !== accountToRemove.id),
            );
        },
        [form],
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = (data: TForm): void => {
        const balances: TAccountBalance[] = data.balances.map(({ accountId, formula }) => ({
            accountId,
            balance: evaluateForSure(formula),
        }));

        const exchangeRates: TExchangeRate[] = data.exchangeRates.map(({ formula, currencyId }) => ({
            currencyId,
            quote: evaluateForSure(formula),
        }));

        dispatch(
            actions.storeReport({
                balances,
                exchangeRates,
                createdAt: data.createdAt,
            }),
        );
        navigate('/');
    };

    const currencies = useSelector(getCurrenciesToShow);

    if (reportToEditId && !reportToEdit) {
        return navigate('/');
    }

    return (
        <>
            <Container>
                <Stack
                    direction='row'
                    gap={3}
                    justifyContent='flex-end'
                    sx={{ mt: 3, mb: 3 }}
                >
                    <Button
                        startIcon={<AddIcon />}
                        variant='outlined'
                        onClick={toggleNewAccountModal}
                    >
                        Account
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        variant='outlined'
                        onClick={toggleNewCurrencyModal}
                    >
                        Currency
                    </Button>
                </Stack>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <Stack spacing={3}>
                            <DatePickerElement
                                control={form.control}
                                name='createdAt'
                                label='Report Date'
                                format='dd/LL/yyyy'
                            />

                            <S.Table>
                                {currencies.map((currency) => (
                                    <AccountsGroupedByCurrency
                                        key={currency.id}
                                        currency={currency}
                                        onAdd={handleAccountAdd}
                                        onRemove={handleAccountRemove}
                                    />
                                ))}
                            </S.Table>
                            <CurrenciesQuotes />
                            <Stack
                                direction='row'
                                gap={3}
                                justifyContent='flex-end'
                            >
                                <Button
                                    variant='text'
                                    component={Link}
                                    to='/'
                                >
                                    Cancel
                                    {
                                        // TODO confirmation needed
                                    }
                                </Button>
                                <Button
                                    variant='contained'
                                    type='submit'
                                    // disabled={!form.formState.isValid}
                                >
                                    {
                                        // TODO confirmation needed
                                    }
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </FormProvider>
            </Container>

            <AddAccountModal
                open={openNewAccountModal}
                onClose={toggleNewAccountModal}
                onAdd={handleAccountAdd}
            />

            <AddCurrencyModal
                open={openNewCurrencyModal}
                onClose={toggleNewCurrencyModal}
            />
        </>
    );
};

export default ReportFormPage;
