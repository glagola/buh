import { type NextPage } from 'next';

import ReportFormPage from '@/components/page-report-form';

type TProps = {
    params: {
        id: string;
    };
};

const EditRoutePage: NextPage<TProps> = ({ params }) => {
    return <ReportFormPage id={params.id} />;
};

export default EditRoutePage;
