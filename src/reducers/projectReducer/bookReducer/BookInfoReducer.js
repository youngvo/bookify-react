import {
    SET_BOOK_INFO,
    CHANGE_THEME_OF_BOOK,
    TOGGLE_CHANGE_LOGO_OF_BOOK
} from './../../../actions/projectActions/bookActions/BookInfoActions';

let bookInfoDefault = {
    format: 'large_landscape',
    theme: 'blurb.elegant',
    schema_version: '1.0',
    isLogoChanged: false
}

export default function bookInfoReducer(bookInfo = bookInfoDefault, action) {
    switch (action.type) {
        case SET_BOOK_INFO:
            return handleSetBookInfo(bookInfo, action.payload);
        case CHANGE_THEME_OF_BOOK:
            return changeThemeOfBook(bookInfo, action.theme);
        case TOGGLE_CHANGE_LOGO_OF_BOOK:
            return changedLogoOfBook(bookInfo);
        default: return bookInfo;
    }
};

function changedLogoOfBook(bookInfo) {
    return {
        ...bookInfo,
        isLogoChanged: !bookInfo.isLogoChanged
    };
}

function handleSetBookInfo(bookInfo, { format, theme }) {
    let result = {...bookInfo};
    result.format = format;
    result.theme = theme;

    return result;
}

function changeThemeOfBook(bookInfo, theme) {
    return {
        ...bookInfo,
        theme
    };
}
