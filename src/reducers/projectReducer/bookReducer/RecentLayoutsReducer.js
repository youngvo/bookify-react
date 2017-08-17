import {SET_RECENT_LAYOUTS} from './../../../actions/projectActions/bookActions/RecentLayoutsActions'

const MAX_NUMBER_RECENT_LAYOUT = 6;
export default function recentLayoutsReducer(recentLayouts = [], action) {
    switch (action.type) {
        case SET_RECENT_LAYOUTS:
            return handleSetRecentLayouts(recentLayouts, action.payload);
        default: return recentLayouts;
    }
};

function handleSetRecentLayouts(recentLayouts, {recentLayoutData}) {
    for (let i = 0; i < recentLayouts.length; i++) {
        if (recentLayouts[i].$.id === recentLayoutData.$.id) {
            for (let j = i; j < recentLayouts.length; j++) {
                let temp = recentLayouts[j];
                recentLayouts[j] = recentLayouts[i];
                recentLayouts[i] = temp;
            }
            return recentLayouts;
        }
    }
    recentLayouts.push(recentLayoutData);
    if(recentLayouts.length === MAX_NUMBER_RECENT_LAYOUT + 1) {
        recentLayouts.splice(0, 1);
    }
    return recentLayouts;
}

