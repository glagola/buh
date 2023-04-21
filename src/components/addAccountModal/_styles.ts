import { styled } from '@mui/material';

export const Form = styled('form')`
    display: flex;
    gap: ${({ theme }) => theme.spacing(3)};
    flex-direction: column;
`;
