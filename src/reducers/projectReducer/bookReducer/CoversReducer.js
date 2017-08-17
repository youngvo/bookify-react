import Utils from '././../../../utils/Utils';
import {
    SET_COVERS,
    ADD_NEW_IMAGE_INTO_COVER,
    SET_COVER_TYPE,
    UPDATE_IMAGE_INTO_COVER,
    SET_COVER_LAYOUT_INTO_BOOK,
    REMOVE_IMAGE_IN_COVER,
    UPDATE_TEXT_INTO_COVER,
    CHANGE_BACKGROUND_COLOR_FOR_COVER
} from './../../../actions/projectActions/bookActions/CoversActions';
import textContainerReducer from './pagesReducer/TextContainerReducer';
import textContainerActionCreators from './../../../actions/projectActions/bookActions/pagesActions/TextContainerActions';
import { parseTextSource } from './pagesReducer/PagesReducer';

let coverDefault = {};
export default function coverReducer(covers = coverDefault, action) {
    switch (action.type) {
        case SET_COVERS:
            return handleSetCovers(covers, action.payload);
        case ADD_NEW_IMAGE_INTO_COVER:
            return addImageIntoImageContainer(covers, action.payload.cover);
        case SET_COVER_TYPE:
            return handleSetCoverType(covers, action.payload);
        case SET_COVER_LAYOUT_INTO_BOOK:
            return handleSetCoverLayout(covers, action.payload);
        case UPDATE_IMAGE_INTO_COVER:
            return updateImageOfImageContainer(covers, action.payload.cover);
        case REMOVE_IMAGE_IN_COVER:
            return removeImageOfImageContainer(covers, action.payload.cover);
        case UPDATE_TEXT_INTO_COVER:
            return updateTextOfTextContainer(covers, action.payload.cover);
        case CHANGE_BACKGROUND_COLOR_FOR_COVER:
            return changeBackgroundColor(covers, action.payload.backgroundId);
        default:
            return covers;
    }
};

function handleSetCoverType(covers, {coverType}) {
    let result = {...covers};
    let coverInfo = result.coverInfo;
    coverInfo.type = coverType;

    return result;
}

function handleSetCovers(covers , {coverInfo, backCover, backFlap, frontCover, frontFlap, spine}) {
    let result = {...covers};
    result.coverInfo = coverInfo;
    result.coverInfo.type = 'imagewrap';
    result.backCover = backCover;
    result.backFlap = backFlap;
    result.frontCover = frontCover;
    result.frontFlap = frontFlap;
    result.spine = spine;

    for (let key in result) {
        let cover = result[key];
        if (!cover.TextContainer) continue;
        cover.TextContainer.forEach((container)=>{
            container.parsedText = container.parsedText ? JSON.parse(container.parsedText) : parseTextSource(container.Text);
        });
    }

    return result;
}

function handleSetCoverLayout(covers, { idPage, newLayout }) {
    let coversResult = {...covers};
    let cover = getCoverByPageId(idPage, coversResult);
    changeLayoutForCover(cover, newLayout);
    return coversResult;
}

//imageData {idPage, idPageLayout, idLayout, imageObject}
function addImageIntoImageContainer(covers, { idPage, idLayout, imageObject }) {
    let coversResult = {...covers};
    let cover = getCoverByPageId(idPage, coversResult);

    if (!cover.ImageContainer) {
        cover.ImageContainer = [];
    }

    cover.ImageContainer = [...cover.ImageContainer];

    let imageContainerMember = getImageContainerMember(idLayout, cover.ImageContainer);

    cover.ImageContainer[imageContainerMember.index] = handleAddImageContainer(imageContainerMember.imageContainer, {idLayout, imageObject});

    return coversResult;
}

function handleAddImageContainer(imageContainer, { idLayout, imageObject }) {
    let imageContainerResult = {...imageContainer};
    imageContainerResult.$ = {ref_id:idLayout};

    imageContainerResult.Image = {
        src: '',
        fit_policy: 'fill',
        rotation: 0,
        x_shift: 0,
        y_shift: 0,
        zoom_level: '100',
        image_source_id: ''
    };
    imageContainerResult.Image.src = Utils.replaceLowImageByOrigin(imageObject.imageUrl);
    imageContainerResult.Image.image_source_id = imageObject.baseId;

    return imageContainerResult;
}

function updateImageOfImageContainer(covers, { idPage, idLayout, imageObject }) {
    let coversResult = {...covers};
    let cover = getCoverByPageId(idPage, coversResult);

    let imageContainerMember = getImageContainerMember(idLayout, cover.ImageContainer);

    cover.ImageContainer = [...cover.ImageContainer];
    cover.ImageContainer[imageContainerMember.index] = handleUpdateImageContainer(imageContainerMember.imageContainer, {idLayout, imageObject});

    return coversResult;
}

function handleUpdateImageContainer(imageContainer, { idLayout, imageObject }) {
    let imageContainerResult = {...imageContainer};

    // imageContainerResult.$.ref_id = idLayout;
    imageContainerResult.Image = { ...imageContainerResult.Image };
    imageContainerResult.Image.src = imageObject.imageUrl;
    imageContainerResult.Image.image_source_id = imageObject.baseId;
    imageContainerResult.Image.fit_policy = imageObject.fit_policy;
    imageContainerResult.Image.rotation = imageObject.rotation;
    imageContainerResult.Image.x_shift = imageObject.x_shift;
    imageContainerResult.Image.y_shift = imageObject.y_shift;
    imageContainerResult.Image.zoom_level = imageObject.zoom_level;
    
    return imageContainerResult;
}

function removeImageOfImageContainer(covers, { idLayout, idPage }) {
    let coversResult = {...covers};
    let cover = getCoverByPageId(idPage, coversResult);

    let imageContainerMember = getImageContainerMember(idLayout, cover.ImageContainer);
    if (!imageContainerMember.imageContainer) {
        return covers;
    }

    cover.ImageContainer = [...cover.ImageContainer];
    cover.ImageContainer[imageContainerMember.index] = handleRemoveImageOfImageContainer(imageContainerMember.imageContainer);

    return coversResult;
}

function handleRemoveImageOfImageContainer(imageContainer) {
    let imageContainerResult = {...imageContainer};
    delete imageContainerResult.Image;
    return imageContainerResult;
}

function getImageContainerMember(idLayout, imageContainers) {
    let imageContainerMember = {
        imageContainer: undefined,
        index: 0
    };

    imageContainers.forEach((imageContainer, index) => {
        if (imageContainer.$.ref_id === idLayout) {
            imageContainerMember = {
                imageContainer,
                index
            };
        }
    });

    return imageContainerMember;
}

function updateTextOfTextContainer(covers, { idPage, idLayout, textObject }) {
    let coversResult = {...covers};
    let cover = getCoverByPageId(idPage, coversResult);

    if (!cover.TextContainer) {
        cover.TextContainer = [];
    }

    cover.TextContainer = [...cover.TextContainer];

    let textContainerMember = getTextContainerMember(idLayout, cover.TextContainer);
    cover.TextContainer[textContainerMember.index] = textContainerReducer(textContainerMember.textContainer, textContainerActionCreators.updateText(idLayout, textObject));

    return coversResult;
}

function getTextContainerMember(idLayout, textContainers) {
    let result = {
        textContainer: undefined,
        index: 0
    };

    textContainers.forEach((textContainer, index) => {
        if (textContainer.$.ref_id === idLayout) {
            result = {
                textContainer,
                index
            };
        }
    });

    result.index = textContainers.length;

    return result;
}

function getCoverByPageId(idPage, covers) {
    let cover = {};
    let id = idPage.toString();

    if (id==='-1') cover = covers.frontCover;
    else if (id==='99999') cover = covers.backCover;
    else if (id==='-2') cover = covers.spine;
    else if (id==='-3') cover = covers.frontFlap;
    else if (id === '-4') cover = covers.backFlap;

    return cover;
}

function changeLayoutForCover(cover, newLayout) {
    cover.layout_group_id = newLayout.$.group_id;
    let imgContainerIds = {};
    if (newLayout.ImageContainer) {
        for (let i in newLayout.ImageContainer) {
            imgContainerIds[i] = newLayout.ImageContainer[i].$.id;
        }
    }

    let textContainerIds = {};
    if (newLayout.TextContainer) {
        for (let i in newLayout.TextContainer) {
            imgContainerIds[i] = newLayout.TextContainer[i].$.id;
        }
    }

    let pastImgContainerArr = [];
    if (cover.ImageContainer) {
        for (let i in cover.ImageContainer) {
            if (cover.ImageContainer[i].Image) {
                pastImgContainerArr.push({Image: cover.ImageContainer[i].Image});
            }
        }
    }

    let pastTextContainerArr = [];
    if (cover.TextContainer) {
        for (let i in cover.TextContainer) {
            if (cover.TextContainer[i].parsedText) {
                pastTextContainerArr[i] = {};
                pastTextContainerArr.push({parsedText: cover.TextContainer[i].parsedText});
            }
        }
    }

    if (!cover.ImageContainer) cover.ImageContainer = [];
    if (!cover.TextContainer) cover.TextContainer = [];

    for (let i in imgContainerIds) {
        cover.ImageContainer[i] = {};
        cover.ImageContainer[i].$ = {};
        cover.ImageContainer[i].$.ref_id = imgContainerIds[i];
        if (pastImgContainerArr[i] && pastImgContainerArr[i].Image) {
            let imageSource = {...pastImgContainerArr[i].Image};
            cover.ImageContainer[i].Image = {
                fit_policy: 'fill',
                image_source_id: imageSource.image_source_id,
                rotation: 0,
                src: imageSource.src,
                x_shift: 0,
                y_shift: 0,
                zoom_level: 0,
            }
        }
    }

    for (let i in textContainerIds) {
        cover.TextContainer[i] = {};
        cover.TextContainer[i].$ = {};
        cover.TextContainer[i].$.ref_id = textContainerIds[i];
        if (pastTextContainerArr[i] && pastTextContainerArr[i].parsedText) {
            cover.TextContainer[i].parsedText = pastTextContainerArr[i].parsedText;
        }
    }
    return cover;
}


function changeBackgroundColor(covers, backgroundId) {
    let { backCover, backFlap, coverInfo, frontCover, frontFlap, spine } = covers;
    backCover.background_id = backgroundId;
    backFlap.background_id = backgroundId;
    coverInfo.background_id = backgroundId;
    frontCover.background_id = backgroundId;
    frontFlap.background_id = backgroundId;
    spine.background_id = backgroundId;
    return covers;
}