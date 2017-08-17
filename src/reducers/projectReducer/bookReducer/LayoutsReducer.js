import {SET_LAYOUTS} from './../../../actions/projectActions/bookActions/LayoutsActions'
import { LAYOUT_TYPE_TEXT_MISC } from './../../../constants/Constants';

let layoutsDefault = {};
let layoutOnePhotoList = [];
let layoutTwoPhotoList = [];
let layoutThreePhotoList = [];
let layoutFourPhotoList = [];
let layoutFivePlusPhotoList = [];
let layoutTextMiscList = [];

let typesOfLayouts = [
    layoutOnePhotoList,
    layoutTwoPhotoList,
    layoutThreePhotoList,
    layoutFourPhotoList,
    layoutFivePlusPhotoList,
    layoutTextMiscList
];

export default function layoutsReducer(layouts = layoutsDefault, action) {
    switch (action.type) {
        case SET_LAYOUTS:
            return handleSetLayouts(action.payload);
        default: return layouts;
    }
};

function handleSetLayouts({layouts}) {
    layouts.typesOfLayouts = typesOfLayouts;
    const { PageLayout } = layouts;
    for (let index = 0; index < PageLayout.length; index++) {
        let layoutItem = PageLayout[index];
        let layoutID = layoutItem.$.id;
        let isIdInValid = layoutID.includes("designerbook") || layoutID.includes("chickensoup") || layoutID.includes("paloalto")
            || layoutID.includes("yearbook") || layoutID.includes("multi") || layoutID.includes("zero");
        if (!isIdInValid && !layoutItem.hasOwnProperty('LockedImageContainer')) {
            let type = (layoutItem.$.hasOwnProperty('type') ) ? layoutItem.$.type : '';
            if (type === LAYOUT_TYPE_TEXT_MISC.BLANK || type === LAYOUT_TYPE_TEXT_MISC.COPYRIGHT
                || type === LAYOUT_TYPE_TEXT_MISC.TEXT_ONLY || type === LAYOUT_TYPE_TEXT_MISC.TITLE
                || type === LAYOUT_TYPE_TEXT_MISC.TWO_COLUMNS || type === LAYOUT_TYPE_TEXT_MISC.THREE_COLUMNS
                || type === LAYOUT_TYPE_TEXT_MISC.LOGO || type === LAYOUT_TYPE_TEXT_MISC.CHAPTER) {
                layoutTextMiscList.push(layoutItem);
            }
            else if (layoutItem.hasOwnProperty('ImageContainer')) {
                switch (layoutItem['ImageContainer'].length) {
                    case 1:
                        layoutOnePhotoList.push(layoutItem);
                        break;
                    case 2:
                        layoutTwoPhotoList.push(layoutItem);
                        break;
                    case 3:
                        layoutThreePhotoList.push(layoutItem);
                        break;
                    case 4:
                        layoutFourPhotoList.push(layoutItem);
                        break;
                    default:
                        layoutFivePlusPhotoList.push(layoutItem);
                        break;
                }
            }
        }
    }
    return layouts;
}
