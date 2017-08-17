import { SET_AUTO_FLOW_LAYOUTS, CHANGE_CURR_CHOOSE_LAYOUT } from './../../actions/autoFlowLayoutsActions/AutoFlowLayoutsActions';
import { validThemes } from './../../constants/Constants';

let autoFlowLayoutsDefault = {
    //trimSize: 'square',
    //options: [{default_for_theme: '', layoutIdLeft:'', layoutIdRight:''}]
    //optionsOriginal: [{default_for_theme: '', layoutIdLeft:'', layoutIdRight:''}]
    trimSize: '',
    layouts: [],
    layoutsOriginal: [],
    currChooseLayout: {}
};
export default function autoFlowLayoutsReducer(autoFlowLayouts = autoFlowLayoutsDefault, action) {
    switch(action.type) {
        case SET_AUTO_FLOW_LAYOUTS:
            return handleSetAutoFlowLayouts(autoFlowLayouts, action.payload);
        case CHANGE_CURR_CHOOSE_LAYOUT:
            return handleChangeCurrChooseLayout(autoFlowLayouts, action.payload);
        default: return autoFlowLayouts;
    }
};

function handleSetAutoFlowLayouts(autoFlowLayouts, {autoFlowLayoutsData}) {
    let autoFlowLayoutsResult = {...autoFlowLayouts};

    const { AutoflowLayouts } = autoFlowLayoutsData;
    autoFlowLayoutsResult.trimSize = AutoflowLayouts.$.trim_size;

    const { Option } = AutoflowLayouts;
    Option.forEach((op) => {
        let layout = {};
        if (op.$) {
            layout.defaultForTheme = op.$.default_for_theme;
            layout.layoutIdLeft = op.Layout[0].$.id;
            layout.layoutIdRight = op.Layout[1].$.id;

            autoFlowLayoutsResult.layouts.push(layout);

            if (isOptionOriginal(layout.defaultForTheme)) {
                cheatTypeAndImageForLayout(layout);
                autoFlowLayoutsResult.layoutsOriginal.push(layout);
            }
        }
    });

    setDefaultCurrLayout(autoFlowLayoutsResult);

    return autoFlowLayoutsResult;
}

function isOptionOriginal(defaultForTheme) {
    return validThemes.indexOf(defaultForTheme) >= 0;
}

function cheatTypeAndImageForLayout(layout) {
    layout.layoutType = layout.defaultForTheme;
    layout.imageName = `img_page_layout_${layout.layoutType}`;
}

function setDefaultCurrLayout(autoFlowLayouts) {
    autoFlowLayouts.currChooseLayout = autoFlowLayouts.layoutsOriginal[0];
}

function handleChangeCurrChooseLayout(autoFlowLayouts, { chooseLayout }) {
    return {
        ...autoFlowLayouts,
        currChooseLayout : chooseLayout
    };
}
