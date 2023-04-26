import { z } from 'zod';

import { ZAccountState } from '@/entites';

export const historyItemFormSchema = z.record(z.array(ZAccountState));

export type THistoryItemForm = z.infer<typeof historyItemFormSchema>;
