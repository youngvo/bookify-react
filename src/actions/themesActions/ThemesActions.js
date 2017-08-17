export const SET_THEMES = 'SET_THEMES';

export function setThemes(themes) {
    return {
        type: SET_THEMES,
        payload: {
            themes
        }
    }
}