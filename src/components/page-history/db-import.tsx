import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@mui/material';
import { type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';

import { zBuh, type TBuh } from '@/entites';
import { actions } from '@/store/buh';

const parse = (s: string): TBuh => {
    const obj = JSON.parse(s) as unknown;

    return zBuh.parse(obj);
};

const readFileContent = async (file: File) =>
    new Promise<string>((resolve, reject) => {
        if (!('FileReader' in window)) {
            reject('FileReader is not supported');
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            }

            reject('Unable to read file as a string');
        });
        reader.readAsText(file);
    });

const ImportDB = () => {
    const dispatch = useDispatch();

    const handleFileSelection = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        e.target.value = '';

        try {
            const content = await readFileContent(file);
            const newBuh = parse(content);

            dispatch(actions.loadFromFile(newBuh));
        } catch (e) {
            // TODO show error as notification/toats
            console.log(e);
        }
    };

    return (
        <Button
            startIcon={<CloudUploadIcon />}
            variant='outlined'
            component='label'
        >
            Load DB
            <input
                type='file'
                style={{ display: 'none' }}
                accept='application/json'
                onChange={handleFileSelection}
            />
        </Button>
    );
};

export default ImportDB;
