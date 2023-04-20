import { Autocomplete, Box, Button, Modal, TextField, Typography } from '@mui/material';
import { type FC } from 'react';

import { type TAccount, type TCurrency } from '@/entites';

type TProps = {
    open: boolean;
    currencies: TCurrency[];
    accounts: TAccount[];
    onCancel: () => void;
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,

    display: 'flex',
    gap: 3,
    flexDirection: 'column',
};

const getCurrencyLabel = (currency: TCurrency) => currency.isoCode;

const AddAccountModal: FC<TProps> = (props) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onCancel}
        >
            <Box sx={style}>
                <Typography
                    component='h2'
                    variant='h5'
                    sx={{
                        borderBottom: '1px solid #eee',
                        pb: 1,
                    }}
                >
                    Add account
                </Typography>
                <TextField label='Title' />

                <Autocomplete
                    disablePortal
                    options={props.currencies}
                    getOptionLabel={getCurrencyLabel}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Currency'
                        />
                    )}
                    onChange={(_, v) => console.log(v)}
                />

                <Box sx={{ textAlign: 'right' }}>
                    <Button
                        variant='text'
                        onClick={props.onCancel}
                        sx={{ mr: 3 }}
                    >
                        Cancel
                    </Button>
                    <Button variant='contained'>Add</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddAccountModal;
