import {SET_COVER_LAYOUTS} from './../../actions/coverLayoutsActions/CoverLayoutsActions';
import { FRONT_COVER_TYPES } from './../../constants/Constants';

let coverLayoutsDefault = {};
let dustJacket = [];
let imageWrap = [];
let softCover = [];
let typesOfFrontCoverLayouts = [
    dustJacket,imageWrap, softCover
];

export default function coverLayoutsReducer(coverLayouts = coverLayoutsDefault, action) {
    switch (action.type) {
        case SET_COVER_LAYOUTS:
            return handleSetCoverLayouts(action.payload);
        default: return coverLayouts;
    }
};

function handleSetCoverLayouts({coverLayouts}) {
    coverLayouts.typesOfFrontCoverLayouts = typesOfFrontCoverLayouts;
    let coverLayoutList = coverLayouts.CoverLayouts.CoverLayout;
    for (let index = 0; index < coverLayoutList.length; index++) {
        let coverLayoutItem = coverLayoutList[index];
        let coverLayoutId = coverLayoutItem.$.id;
        let isIdInValid = coverLayoutId.includes("designerbook") || coverLayoutId.includes("chickensoup") || coverLayoutId.includes("paloalto")
            || coverLayoutId.includes("yearbook") || coverLayoutId.includes("multi") || coverLayoutId.includes("zero");
        if (!isIdInValid && !coverLayoutItem.hasOwnProperty('LockedImageContainer') && coverLayoutItem.$.segment_type === 'front'){
            switch(coverLayoutItem.$.cover_type) {
                case FRONT_COVER_TYPES.DUST_JACKET:
                    dustJacket.push(coverLayoutItem);
                    break;
                case FRONT_COVER_TYPES.IMAGE_WRAP:
                    imageWrap.push(coverLayoutItem);
                    break;
                default:
                    softCover.push(coverLayoutItem);
                    break;
            }
        }
    }
    return coverLayouts;
}