import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button } from '@mui/material';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, getExportDB } from '@/store/buh';

const ExportDB = () => {
    const buh = useSelector(getExportDB);
    const dispatch = useDispatch();

    const handleExportDB = useCallback(() => {
        const fileData = JSON.stringify(buh, undefined, 4);
        const blob = new Blob([fileData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${DateTime.now().toFormat('yyyy-LL-dd')} buh.json`;
        link.href = url;
        link.click();

        dispatch(actions.changesSaved());
    }, [buh, dispatch]);

    return (
        <Button
            startIcon={<CloudDownloadIcon />}
            variant='outlined'
            onClick={handleExportDB}
        >
            Save DB
        </Button>
    );
};

export default ExportDB;
