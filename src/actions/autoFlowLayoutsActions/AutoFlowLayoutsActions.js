const PRE_FIX = 'autoFlowLayouts/';
export const SET_AUTO_FLOW_LAYOUTS = PRE_FIX + 'SET_AUTO_FLOW_LAYOUTS';
export const CHANGE_CURR_CHOOSE_LAYOUT = PRE_FIX + 'CHANGE_CURR_CHOOSE_LAYOUT';

export function setAutoFlowLayouts(autoFlowLayouts) {
    return {
        type: SET_AUTO_FLOW_LAYOUTS,
        payload: {
            autoFlowLayoutsData:autoFlowLayouts
        }
    }
}

export function changeCurrChooseLayout(chooseLayout) {
    return {
        type: CHANGE_CURR_CHOOSE_LAYOUT,
        payload: {
            chooseLayout
        }
    }
}