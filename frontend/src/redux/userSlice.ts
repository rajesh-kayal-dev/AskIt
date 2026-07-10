import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from '../features/auth/types/auth.types';

interface UserState {
    userData: User | null;
}

const initialState: UserState = {
    userData: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User | null>) => {
            state.userData = action.payload;
        }
    }
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;