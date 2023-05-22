import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Button } from '@mui/material';
import { useCallback } from 'react';

import { useDBExport } from '@/store/history';

const ExportDB = () => {
    const buh = useDBExport();

    const handleExportDB = useCallback(() => {
        const fileData = JSON.stringify(buh, undefined, 4);
        const blob = new Blob([fileData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'buh-history.json';
        link.href = url;
        link.click();
    }, [buh]);

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
