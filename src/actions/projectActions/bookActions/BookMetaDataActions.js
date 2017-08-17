const PRE_FIX = 'bookMetaData/';
export const SET_BOOK_META_DATA = PRE_FIX + 'SET_BOOK_META_DATA';

export function setBookMetaData(author, authorEmail, subtitle, title, createdContext) {
    return {
        type: SET_BOOK_META_DATA,
        payload: {
            author,
            authorEmail,
            subtitle,
            title,
            createdContext
        }
    };
}
