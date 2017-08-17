export const SET_LAYOUTS = 'SET_LAYOUTS';

export function setLayouts(layouts) {
    return {
        type: SET_LAYOUTS,
        payload: {
            layouts
        }
    }
}