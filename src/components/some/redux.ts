import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

// Define a type for the slice state
interface CounterState {
    value: number;
}

// Define the initial state using that type
const initialState: CounterState = {
    value: 0,
};

export const name = 'counter';

const slice = createSlice({
    name,
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
    },
});

export const actions = slice.actions;

export const selectCount = (state: RootState) => state[name].value;

export const reducer = slice.reducer;
