export const SET_RECENT_LAYOUTS = 'SET_RECENT_LAYOUTS';

export function setRecentLayouts(recentLayoutData) {
    return {
        type: SET_RECENT_LAYOUTS,
        payload: {
            recentLayoutData
        }
    }
}