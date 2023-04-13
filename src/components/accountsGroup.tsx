import { ArchiveBoxIcon, PencilIcon, XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { type FC } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import type { TCurrency, TAccountState } from '@/entites';
import { archivedAccountsGroupByCurrencyAndSortByUsage } from '@/store/history';
import { isFormulaValid } from '@/validators';

import MoneyInput from './moneyInput';

type TProps = {
    title: string;
    currency: TCurrency;
    accounts: TAccountState[];
};

const iconSize = 'w-4 h-4 hover:cursor-pointer hover:text-blue-600';

const AccountsGroup: FC<TProps> = (props) => {
    const [isArchiving, toggleArchive] = useToggle(false);

    const archivedAccontsByCurrency = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);
    const archivedAccounts = archivedAccontsByCurrency.get(props.currency) ?? [];

    return (
        <FieldArray<TAccountState> name={`accounts.${props.currency.isoCode}`}>
            {({ fields }) => (
                <div className='mb-10 last:mb-0'>
                    <div className='font- flex justify-between'>
                        <h2>{props.title}</h2>
                        {isArchiving ? (
                            <XMarkIcon
                                className={iconSize}
                                onClick={toggleArchive}
                            />
                        ) : (
                            <PencilIcon
                                className={iconSize}
                                onClick={toggleArchive}
                            />
                        )}
                    </div>

                    <div
                        className={clsx('grid items-center gap-4', {
                            'grid-cols-[max-content_1fr_min-content]': isArchiving,
                            'grid-cols-[max-content_1fr]': !isArchiving,
                        })}
                    >
                        {fields.map((name, index) => (
                            <Field<TAccountState>
                                key={name}
                                name={name}
                                validate={(accountState) => isFormulaValid(accountState.formula)}
                            >
                                {({ input, meta }) => {
                                    const accountState = fields.value[index];

                                    if (undefined === accountState) throw new Error('never');

                                    const account = accountState.account;

                                    return (
                                        <>
                                            <MoneyInput
                                                title={`${account.title}, ${account.currency.isoCode}`}
                                                value={input.value.formula}
                                                error={meta.error as ReturnType<typeof isFormulaValid>}
                                                onChange={(formula) =>
                                                    input.onChange({
                                                        formula,
                                                        account,
                                                    } as TAccountState)
                                                }
                                            />
                                            {isArchiving && (
                                                <ArchiveBoxIcon
                                                    className={iconSize}
                                                    onClick={() => fields.remove(index)}
                                                />
                                            )}
                                        </>
                                    );
                                }}
                            </Field>
                        ))}
                    </div>
                    {isArchiving &&
                        (() => {
                            const currentAccounts = new Set((fields.value ?? []).map(({ account }) => account.id));
                            const leftInArchive = archivedAccounts.filter(
                                ({ account }) => !currentAccounts.has(account.id),
                            );

                            if (!leftInArchive.length) return;

                            return (
                                <>
                                    <hr />
                                    <ul>
                                        {leftInArchive.map(({ account, archivedAt }) => (
                                            <li
                                                key={account.title + account.currency.isoCode}
                                                className='flex items-center'
                                            >
                                                {account.title}, {account.currency.isoCode} - {archivedAt.toString()}
                                                <PlusCircleIcon
                                                    className={iconSize}
                                                    onClick={() => {
                                                        fields.push({
                                                            account,
                                                            formula: '',
                                                        });
                                                    }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            );
                        })()}
                </div>
            )}
        </FieldArray>
    );
};

export default AccountsGroup;
