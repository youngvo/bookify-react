export const SET_COVER_LAYOUTS = 'SET_COVER_LAYOUTS';

export function setCoverLayouts(coverLayouts) {
    return {
        type: SET_COVER_LAYOUTS,
        payload: {
            coverLayouts
        }
    }
}