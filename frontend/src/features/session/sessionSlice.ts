import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import { RootState, AppThunk } from "../../app/store";
import { fetchUser } from "./sessionAPI";

export interface UserState {
  id: number;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface SessionRequest {
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SessionRequestData {
  user: SessionRequest;
}

export interface SessionState {
  user: UserState;
  auth_token: string;
}

const initialState: SessionState = {
  user: {
    id: 0,
    email: "",
  },
  auth_token: "",
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<UserState>) => {
      return produce(state, (draft) => {
        draft.user.id = payload.id;
        draft.user.email = payload.email;
      });
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      return produce(state, (draft) => {
        draft.auth_token = action.payload;
      });
    },
  },
});

export const { setUser } = sessionSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUser = (state: RootState) => state.session.user;

export default sessionSlice.reducer;
