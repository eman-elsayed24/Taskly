import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TaskModalState {
  selectedTaskId: string | null;
}

const initialState: TaskModalState = {
  selectedTaskId: null,
};

const taskModalSlice = createSlice({
  name: 'taskModal',
  initialState,
  reducers: {
    openTaskDetails(state, action: PayloadAction<string>) {
      state.selectedTaskId = action.payload;
    },
    closeTaskDetails(state) {
      state.selectedTaskId = null;
    },
  },
});

export const { openTaskDetails, closeTaskDetails } = taskModalSlice.actions;
export default taskModalSlice.reducer;
