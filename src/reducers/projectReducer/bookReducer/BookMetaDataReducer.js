import { SET_BOOK_META_DATA } from './../../../actions/projectActions/bookActions/BookMetaDataActions';

const bookMetaDataDefault = {
    author: '',
    authorEmail: '',
    subtitle: '',
    title: '',
    createdContext: 'bookify-react',
    lastUpdatedContext: 'bookify-react'
};

export default function bookMetaDataReducer(bookMetaData = bookMetaDataDefault, action) {
    switch (action.type) {
        case SET_BOOK_META_DATA:
            return handleSetBookMetaData(bookMetaData, action.payload);
        default:
            return bookMetaData;
    }
}

function handleSetBookMetaData(bookMetaData, { author, authorEmail, subtitle, title, createdContext }) {
    return {
        ...bookMetaData,
        author,
        authorEmail,
        subtitle,
        title,
        createdContext
    }
}
