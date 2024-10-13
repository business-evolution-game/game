declare global {
    declare type RootState = import('./app/store').RootState;
    declare type AppDispatch = import('./app/store').AppDispatch;
}

export {};