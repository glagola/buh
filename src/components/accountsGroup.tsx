import {
    ArchiveBoxIcon,
    PencilIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, type FC } from 'react';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import type { TCurrency, TAccountState } from '@/entites';
import { archivedAccountsGroupByCurrencyAndSortByUsage } from '@/store/history';

import MoneyInput from './moneyInput';

type TProps = {
    title: string;
    currency: TCurrency;
    accounts: TAccountState[];
};

const iconSize = 'w-4 h-4 hover:cursor-pointer hover:text-blue-600';

const AccountsGroup: FC<TProps> = (props) => {
    const [isArchiving, toggleArchive] = useToggle(false);

    const archived = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);

    return (
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
                className={clsx(
                    'grid grid-cols-[max-content_1fr_min-content] items-center gap-4',
                    {
                        'grid-cols-[max-content_1fr_min-content]': isArchiving,
                        'grid-cols-[max-content_1fr]': !isArchiving,
                    },
                )}
            >
                {props.accounts.map(({ account, formula: value }) => (
                    <Fragment key={account.title + props.currency.isoCode}>
                        <MoneyInput
                            title={account.title}
                            currency={account.currency}
                            value={value}
                        />
                        {isArchiving && <ArchiveBoxIcon className={iconSize} />}
                    </Fragment>
                ))}
            </div>

            {isArchiving && (
                <>
                    <hr />
                    <ul>
                        {(archived.get(props.currency) ?? []).map((account) => (
                            <li
                                key={
                                    account.account.title +
                                    props.currency.isoCode
                                }
                            >
                                {account.account.title},{' '}
                                {props.currency.isoCode} -{' '}
                                {account.archivedAt.toString()}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AccountsGroup;
