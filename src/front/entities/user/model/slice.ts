import {createSlice} from '@reduxjs/toolkit';
import {Exception} from "@shared/exception/Exception";


interface AuthState {
    status: 'disconnected' | 'loading' | 'connected';
    error: Exception | null;
    account: object | null;
}

const initialState: AuthState = {
    status: 'disconnected',
    error: null,
    account: null
};

export const authSlice = createSlice({
    name: 'authState',
    initialState,
    reducers: {
        connect: (state: AuthState) => {
            state.status = 'connected';
        },
        disconnect: (state: AuthState) => {
            state.status = 'disconnected';
        }
    },
    // extraReducers: (builder) => {
    // builder.addMatcher(connect, (state) => {
    //     state.status = 'connected'; //todo: what if connecting have been failed
    // }).addMatcher(disconnect, (state) => {
    //     state.status = 'disconnected'; //todo: what if connecting have been failed
    // });
    // },
});


export const { connect, disconnect } = authSlice.actions;