'use client';

import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import { z } from 'zod';

import ReportFormPage from '@/components/page-report-form';

const ZQueryParams = z.object({
    id: z.string().uuid(),
});

const EditRoutePage = () => {
    const router = useRouter();
    const res = ZQueryParams.safeParse(router.query);

    if (res.success) {
        return <ReportFormPage id={res.data.id} />;
    }

    redirect('/pages/create');
};

export default EditRoutePage;
