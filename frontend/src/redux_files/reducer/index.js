export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export function setSignupError(isSignupError) {
    return {
        type: SIGNUP_ERROR,
        isSignupError
    };
}

export function setLoginPending(isLoginPending) {
    return {
        type: LOGIN_PENDING,
        isLoginPending
    };
}

export function setLoginSuccess(isLoginSuccess) {
    return {
        type: LOGIN_SUCCESS,
        isLoginSuccess
    };
}

export function setLoginError(isLoginError) {
    return {
        type: LOGIN_ERROR,
        isLoginError
    };
}


export default function reducer(state = {
    isLoginPending: false,
    isLoginSuccess: false,
    isLoginError: null,
    isSignupError: null
}, action) {
    switch (action.type) {
        case LOGIN_PENDING:
            return {
                ...state,
                isLoginPending: action.isLoginPending
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoginSuccess: action.isLoginSuccess
            };
        case LOGIN_ERROR:
            return {
                ...state,
                isLoginError: action.isLoginError
            };
        case SIGNUP_ERROR:
            return {
                ...state,
                isSignupError: action.isSignupError
            }
        default: return state;
    }
}
