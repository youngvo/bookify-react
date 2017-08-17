import {
    USER_LOGIN_SUCCESS,
    USER_REGISTER_SUCCESS
} from '../../actions/userActions/UserActions';

let userDefault = {
    isLoggedIn: false,
    userVO: {}
}
export default function userReducer(user = userDefault, action) {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return {
                ...user,
                isLoggedIn: true, 
                userVO: action.user
            };
        case USER_REGISTER_SUCCESS:
            return {
                ...user,
                isLoggedIn: true,
                userVO: action.user
            };
        default:
            return user;
    }
};