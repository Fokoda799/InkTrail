import type { UserState, UserAction, ErrorAction } from '../types/userTypes';


const setLoading = (state: UserState) => {
    state.loading = true;
};

const setSuccess = (state: UserState, action: UserAction) => {
    state.me = action.payload;
    state.loading = false;
    state.error = null;
};

const setFailure = (state: UserState, action: ErrorAction) => {
    state.loading = false;
    state.error = action.payload;
};

export { setLoading, setSuccess, setFailure };
