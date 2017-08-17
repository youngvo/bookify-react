export const INVALID_EMAIL = "INVALID_EMAIL";
export const INVALID_USERNAME = "INVALID_USERNAME";
export const VALID_EMAIL = "VALID_EMAIL";
export const VALID_USERNAME = "VALID_USERNAME";
export const EMPTY_EMAIL = " EMPTY_EMAIL";

export function invalidEmailOrUsername(type) {
    if (type === 'email') {
        return { type: INVALID_EMAIL};
    }
    return  { type: INVALID_USERNAME };
};

export function validEmailOrUsername(type) {
    if (type === 'email') {
        return { type: VALID_EMAIL};
    }
    return  { type: VALID_USERNAME };
};

export function emptyEmail() {
    return { type: EMPTY_EMAIL };
};