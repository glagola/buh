export interface TRawAccountDetails {
    title: string;
    currency: TCurrency;
}

export interface TAccount extends TRawAccountDetails {
    id: string;

    createdAt: Date;
}

export type TCurrency = {
    isoCode: string;
};

export type TArchivedAccount = {
    account: TAccount;

    archivedAt: Date;
};

export type TAccountState = {
    account: TAccount;
    formula: string;
};

export type TAccountHistoryState = {
    account: TAccount;
    value: number;
};

export type THistoryItem = {
    accounts: TAccountHistoryState[];

    createdAt: Date;
};

export type TBuh = {
    history: THistoryItem[];
};
