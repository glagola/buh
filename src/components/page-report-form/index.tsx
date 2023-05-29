import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { DatePickerElement } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToggle } from 'react-use';

import { TAccountBalance, TExchangeRate } from '@/entites';
import { actions, getReportByIdMap } from '@/store/buh';
import { evaluateForSure } from '@/utils/expression';

import * as S from './_styles';
import AccountsGroupedByCurrency from './accounts-gropped-by-currency';
import CurrenciesQuotes from './currency-quotes';
import { useAccountActions, useDefaultValues } from './hooks';
import AddAccountModal from './modal/modal-add-account';
import AddCurrencyModal from './modal/modal-add-currency';
import { getCurrenciesToShow } from './selector';
import { TForm, zForm } from './validation';

const ReportFormPage = () => {
    const [openNewAccountModal, toggleNewAccountModal] = useToggle(false);
    const [openNewCurrencyModal, toggleNewCurrencyModal] = useToggle(false);

    const reportById = useSelector(getReportByIdMap);

    const { reportId: reportToEditId } = useParams();
    const reportToEdit = reportToEditId ? reportById.get(reportToEditId) : undefined;

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
                id: reportToEdit?.id,
                balances,
                exchangeRates,
                createdAt: data.createdAt,
            }),
        );
        navigate('/');
    };

    const currencies = useSelector(getCurrenciesToShow);

    const form = useForm<TForm>({
        defaultValues: useDefaultValues(reportToEdit),
        resolver: zodResolver(zForm),
        mode: 'all',
    });

    const [handleAccountAdd, handleAccountRemove] = useAccountActions(form);

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
