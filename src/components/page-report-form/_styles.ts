import { styled } from '@mui/material/styles';

export const Table = styled('div')`
    display: grid;
    grid-template-columns: max-content 1fr max-content;

    ${({ theme }) => `
        row-gap: ${theme.spacing(2)};
        column-gap: ${theme.spacing(2)};
    `}
`;

type TColumnInputProps = {
    archiving: boolean;
};

export const ColumnInput = styled('div')<TColumnInputProps>`
    grid-column: 2 / 4;

    ${(props) => props.archiving && 'grid-column: 2 / 3;'}
`;

export const Row = styled('div')`
    grid-column: 1 / 4;
`;
