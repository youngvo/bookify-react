const PRE_FIX = 'bookInfo/';
export const SET_BOOK_INFO = PRE_FIX + 'SET_BOOK_INFO';
export const CHANGE_THEME_OF_BOOK = PRE_FIX + 'CHANGE_THEME_OF_BOOK';
export const TOGGLE_CHANGE_LOGO_OF_BOOK = PRE_FIX + 'TOGGLE_CHANGE_LOGO_OF_BOOK';

export function setBookInfo(format, theme) {
    return {
        type: SET_BOOK_INFO,
        payload: {
            format,
            theme
        }
    };
}

export function changeThemeOfBook(theme) {
    return {
        type: CHANGE_THEME_OF_BOOK,
        theme
    };
};

export function toggleChangeLogoOfBook() {
    return { type: TOGGLE_CHANGE_LOGO_OF_BOOK };
}