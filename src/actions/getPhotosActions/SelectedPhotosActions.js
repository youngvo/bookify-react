export const SELECT_PHOTO = 'SELECT_PHOTO';
export const DE_SELECT_PHOTO = 'DE_SELECT_PHOTO';

export function selectPhoto(photo) {
    return {
        type: SELECT_PHOTO,
        payload: {
            photo
        }
    }
};

export function deselectPhoto(photo) {
    return {
        type: DE_SELECT_PHOTO,
        payload: {
            photo
        }
    }
}