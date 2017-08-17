export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS";

export function userLoginSuccess(user) {
    return {
        type: USER_LOGIN_SUCCESS,
        user
    };
};

export function userRegisterSuccess(user) {
    return {
        type: USER_REGISTER_SUCCESS,
        user
    };
};