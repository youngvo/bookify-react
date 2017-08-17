import undoable from 'redux-undo';

import Config from './../../../../config/Config';
import Utils from '././../../../../utils/Utils';
import imageContainerReducer from './ImageContainerReducer';
//import imageContainerActionCreators from '../../../../actions/projectActions/bookActions/pagesActions/ImageContainerActions';
import textContainerReducer from './TextContainerReducer';
import textContainerActionCreators from './../../../../actions/projectActions/bookActions/pagesActions/TextContainerActions';
import generateRandomKey from 'draft-js/lib/generateRandomKey';

import {
    SET_PAGES_INTO_BOOK,
    SET_PAGE_LAYOUT_INTO_BOOK,
    SET_PAGE_LAYOUT_IMAGE_BY_AUTO_CREATE_BOOK,
    UPDATE_IMAGE_INTO_PAGE,
    REMOVE_IMAGE_IN_PAGE,
    ADD_PAGE_IN_BOOK,
    DELETE_PAGE_IN_BOOK,
    UPDATE_TEXT_INTO_PAGE,
    ADD_NEW_IMAGE_INTO_PAGE,
    DELETE_PAGES_CONTENT_IN_BOOK,
    DELETE_PAGES_LIST_IN_BOOK,
    REARRANG_PAGES,
    UPDATE_TEXT_STYLE_OF_PAGES,
    CHANGE_BACKGROUND_FOR_PAGE,
    CHANGE_BACKGROUND_FOR_ALL_PAGES
} from './../../../../actions/projectActions/bookActions/pagesActions/PagesActions'
import { DELETE_PHOTO_CARD } from './../../../../actions/photoListActions/PhotoListActions'
import {
    UNDO_REDO_IMAGE_CONTAINER,
    UNDO_REDO_TEXT_CONTAINER
} from './../../../../actions/undoActions/UndoActions';

let pagesDefault = [
    //numPage: Page {ImageContainer, TextContainer, PageInfo}
    //...
];

function pageReducer(pages = pagesDefault, action) {
    switch (action.type) {
        case SET_PAGES_INTO_BOOK:
            return handleSetPages(action.payload);
        case SET_PAGE_LAYOUT_INTO_BOOK:
            return handleSetPageLayout(pages, action.payload);
        case SET_PAGE_LAYOUT_IMAGE_BY_AUTO_CREATE_BOOK:
            return handleSetPageLayoutImageByAutoCreateBook(pages, action.payload);
        case UPDATE_IMAGE_INTO_PAGE:
            return updateImageOfImageContainer(pages, action.payload.page);
        case ADD_NEW_IMAGE_INTO_PAGE:
            return addImageIntoImageContainer(pages, action.payload.page);
        case REMOVE_IMAGE_IN_PAGE:
            return removeImageOfImageContainer(pages, action.payload.page);
        case UPDATE_TEXT_INTO_PAGE:
            return updateTextOfTextContainer(pages, action.payload.page);
        case ADD_PAGE_IN_BOOK:
            return handleAddPage(pages, action.position);
        case DELETE_PAGE_IN_BOOK:
            return deletePageInBook(pages, action.numPage);
        case UNDO_REDO_IMAGE_CONTAINER:
            return handleUndoOrRedoForImageContainer(pages, action.payload);
        case UNDO_REDO_TEXT_CONTAINER:
            return handleUndoOrRedoForImageContainer(pages, action.payload.page);
        case DELETE_PAGES_CONTENT_IN_BOOK:
            return deletePagesContentInBook(pages, action.pagesChoosing);
        case DELETE_PAGES_LIST_IN_BOOK:
            return deletePagesListInBook(pages, action.pagesChoosing);
        case DELETE_PHOTO_CARD:
            return deletePhotoHavingUsingInPages(pages, action.photoId);
        case REARRANG_PAGES:
            return rearrangePages(pages, action.pagesChoosingList, action.position);
        case UPDATE_TEXT_STYLE_OF_PAGES:
            return updateTextStyleOfPages(pages, action.payload);
        case CHANGE_BACKGROUND_FOR_PAGE:
            return changeBackgroundForPage(pages, action.payload);
        case CHANGE_BACKGROUND_FOR_ALL_PAGES:
            return changeBackgroundForAllPages(pages, action.payload);
        default:
            return pages;
    }
}

function handleSetPages({ newPages }) {
    for (let key in newPages) {
        let page = newPages[key];
        page.imageList = [];
        if (!page.TextContainer) continue;
        page.TextContainer.forEach((textContainer)=> {
            textContainer.parsedText = textContainer.parsedText ? JSON.parse(textContainer.parsedText) : parseTextSource(textContainer.Text);
        });
    }
    return newPages;
}

function handleSetPageLayout(pages, { pagesChoosingList, newLayout }) {
    let pagesResult = cloneArray(pages);
    for (let i in pagesChoosingList) {
        pagesResult[pagesChoosingList[i]] = changeLayoutForPage(pagesResult[pagesChoosingList[i]], newLayout);
    }
    return pagesResult;
}

function handleSetPageLayoutImageByAutoCreateBook(pages, { sortedPhotos, layoutLeft, layoutRight, isKeepPagesMade }) {
    console.log('sortedPhotos: ', sortedPhotos);
    console.log('layoutLeft ', layoutLeft);
    console.log('layoutRight ', layoutRight);
    console.log('isKeepPagesMade ', isKeepPagesMade);

    const isPageEdited = (page) => {
        if (page.ImageContainer) {
            for (let i = 0; i < page.ImageContainer.length; i++) {
                if (page.ImageContainer[i].Image) {
                    return true;
                }
            }
        }

        if (page.TextContainer) {
            for (let i = 0; i < page.TextContainer.length; i++) {
                if (page.TextContainer[i].text || page.TextContainer[i].parsedText) {
                    return true;
                }
            }
        }

        return false;
    };

    const getIndexOfLastEditedPage = (pages) => {
        for (let i = pages.length - 2; i >= 1; i--) {
            if (isPageEdited(pages[i])) {
                return i;
            }
        }

        return -1;
    };

    const getIndexOfStartEditablePageOf = (pages, isKeepPagesMade) => {
        let indexOfStartEditablePage = 1;
        if (isKeepPagesMade) {
            let indexOfLastEditedPage = getIndexOfLastEditedPage(pages);
            if (indexOfLastEditedPage !== -1) {
                indexOfStartEditablePage = indexOfLastEditedPage + 1;
            }
        }
        return indexOfStartEditablePage;
    };

    const addMorePagesFor = (pages, countPagesWillAddMore) => {
        let pagesWillBeAdded = [];

        for (let i = 0; i < countPagesWillAddMore; i++) {
            pagesWillBeAdded.push({background_id: 'solid_1'});
        }

        console.log('pages before add ', pages);

        pages.splice(pages.length - 1, 0, ...pagesWillBeAdded);

        console.log('pages after add ', pages);
    };

    const calculateAddMorePages = (pages, countImagesWillAdd, indexOfStartEditablePage, layoutLeft, layoutRight) => {
        let countEditablePages = (pages.length - 1) - indexOfStartEditablePage;
        if (!layoutLeft.ImageContainer || !layoutRight.ImageContainer) {
            countEditablePages = countEditablePages/2;
        }

        let countPagesWillAddMore = countImagesWillAdd - countEditablePages;

        if (!layoutLeft.ImageContainer || !layoutRight.ImageContainer) {
            countPagesWillAddMore = countPagesWillAddMore*2;
        }

        if (countPagesWillAddMore % 2 !== 0) {
            countPagesWillAddMore++;
        }

        console.log('indexOfStartEditablePage ', indexOfStartEditablePage);
        console.log('countEditablePages ', countEditablePages);
        console.log('countPagesWillAddMore ', countPagesWillAddMore);

        if (countPagesWillAddMore > 0) {
            addMorePagesFor(pages, countPagesWillAddMore);
        }
    };

    const isRightPage = (pageIndex) => {
        return (pageIndex % 2 === 0);
    };

    const doChangeLayoutOutAndAddImageForPages = (pages, indexOfStartEditablePage, layoutLeft, layoutRight, photos, isKeepPagesMade) => {
        let currIndexPhoto = 0;

        for (let i = indexOfStartEditablePage; i < pages.length - 1; i++) {
            let newLayout = layoutLeft;
            if (isRightPage(i)) {
                newLayout = layoutRight;
            }

            pages[i] = changeAutoCreateLayoutForPage(pages[i], newLayout, !isKeepPagesMade);

            let imageObject = photos[currIndexPhoto];
            if (imageObject && newLayout.ImageContainer) {
                let imageContainerId = newLayout.ImageContainer[0].$.id;
                doAddImageIntoImageContainerFor(imageContainerId, pages[i], imageObject);
                currIndexPhoto++;
            }
        }
    };

    let pagesResult = cloneArray(pages);

    let indexOfStartEditablePage = getIndexOfStartEditablePageOf(pagesResult, isKeepPagesMade);

    calculateAddMorePages(pagesResult, sortedPhotos.length, indexOfStartEditablePage, layoutLeft, layoutRight);
    doChangeLayoutOutAndAddImageForPages(pagesResult, indexOfStartEditablePage, layoutLeft, layoutRight, sortedPhotos, isKeepPagesMade);

    return pagesResult;
}

function doAddImageIntoImageContainerFor(imageContainerId, page, imageObject) {
    if (!page.ImageContainer) {
        page.ImageContainer = [];
    } else {
        page.ImageContainer = [...page.ImageContainer];
    }

    let imageContainerMember = getImageContainerMemberBy(imageContainerId, page.ImageContainer);

    page.ImageContainer[imageContainerMember.index] = handleAddImageContainer(imageContainerMember.imageContainer, {imageContainerId, imageObject}, page.imageList);
}

//imageData {idPage, idPageLayout, idLayout, imageObject}
function addImageIntoImageContainer(pages, { idPage, idLayout, imageObject }) {
    let pagesResult = cloneArray(pages);
    doAddImageIntoImageContainerFor(idLayout, pagesResult[idPage], imageObject);
    return pagesResult;
}

function handleAddImageContainer(imageContainer, { imageContainerId, imageObject }, imageList) {
    let imageContainerResult = {...imageContainer};
    imageContainerResult.$ = {ref_id:imageContainerId};

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

    if (typeof imageList !== 'undefined') {
        imageList.push({Image: imageContainerResult.Image});
    }

    return imageContainerResult;
}

function handleUpdateImageContainer(imageContainer, { idLayout, imageObject }) {
    let imageContainerResult = {...imageContainer};
    imageContainerResult.Image = {...imageContainerResult.Image};
    imageContainerResult.Image.src = Utils.replaceLowImageByOrigin(imageObject.imageUrl);
    imageContainerResult.Image.image_source_id = imageObject.baseId;
    imageContainerResult.Image.fit_policy = imageObject.fit_policy;
    imageContainerResult.Image.rotation = imageObject.rotation;
    imageContainerResult.Image.x_shift = imageObject.x_shift;
    imageContainerResult.Image.y_shift = imageObject.y_shift;
    imageContainerResult.Image.zoom_level = imageObject.zoom_level;
    return imageContainerResult;
}

function handleRemoveImageOfImageContainer(imageContainer) {
    let imageContainerResult = {...imageContainer};
    delete imageContainerResult.Image;
    return imageContainerResult;
}

function updateImageOfImageContainer(pages, { idPage, idLayout, imageObject }) {
    let pagesResult = cloneArray(pages);
    let page = pagesResult[idPage];

    let imageContainerMember = getImageContainerMemberBy(idLayout, page.ImageContainer);

    page.ImageContainer = [...page.ImageContainer];

    page.ImageContainer[imageContainerMember.index] = handleUpdateImageContainer(imageContainerMember.imageContainer, {idLayout, imageObject});

    return pagesResult;
}

function removeImageOfImageContainer(pages, { idLayout, idPage }) {
    let pagesResult = cloneArray(pages);
    let page = getPage(pagesResult, idPage);

    let imageContainerMember = getImageContainerMemberBy(idLayout, page.ImageContainer);
    if (!imageContainerMember.imageContainer) {
        return pages;
    }

    page.ImageContainer = [...page.ImageContainer];
    page.ImageContainer[imageContainerMember.index] = handleRemoveImageOfImageContainer(imageContainerMember.imageContainer);

    return pagesResult;
}

function handleUndoOrRedoForImageContainer(pages, { idPage, idLayout, undoRedoType }) {
    let pagesResult = cloneArray(pages);
    let page = getPage(pagesResult, idPage);

    let imageContainerMember = getImageContainerMemberBy(idLayout, page.ImageContainer);
    if (!imageContainerMember.imageContainer) {
        return pages;
    }

    page.ImageContainer[imageContainerMember.index] = imageContainerReducer(imageContainerMember.imageContainer, {type:undoRedoType});

    return pagesResult;
}

function updateTextOfTextContainer(pages, { idPage, idLayout, textObject }) {
    let pagesResult = cloneArray(pages);
    let page = getPage(pagesResult, idPage);

    if (!page.TextContainer) {
        page.TextContainer = [];
    }

    page.TextContainer = [...page.TextContainer];

    let textContainerMember = getTextContainerMember(idLayout, page.TextContainer);
    page.TextContainer[textContainerMember.index] = textContainerReducer(textContainerMember.textContainer, textContainerActionCreators.updateText(idLayout, textObject));

    return pagesResult;
}

function handleAddPage(pages, position) {
    let pagesResult = cloneArray(pages);
    return addPageInBookAfterPage(pagesResult, position);
}

function addPageInBookAfterPage(pages, position) {
    let leftPage, rightPage, page1, page2;

    if (position === pages.length) {
        leftPage = pages[position - 3];
        rightPage = pages[position - 2];
    } else {
        leftPage = pages[position - 1];
        rightPage = pages[position];
    }

    page1 = {
        page_layout_id: leftPage.page_layout_id,
        background_id: leftPage.background_id
    };

    page2 = {
        page_layout_id: rightPage.page_layout_id,
        background_id: rightPage.background_id
    };

    pages.splice(position === 2 ? position - 1 : position + 1, 0, page1, page2);
    return pages;
}

function deletePageInBook(pages, numPage) {
    pages.splice(numPage - 1, 2);   //delete 2 pages from position numPage-1
    return pages;
}

function getPage(pages, pageId) {
    return pages[pageId];
}

function getImageContainerMemberBy(imageContainerId, imageContainers) {
    let imageContainerMember = {
        imageContainer: undefined,
        index: imageContainers.length
    };

    imageContainers.forEach((imageContainer, index) => {
        if (imageContainer && imageContainer.$.ref_id === imageContainerId) {
            imageContainerMember = {
                imageContainer,
                index
            };
        }
    });

    return imageContainerMember;
}

function getTextContainerMember(idLayout, textContainers) {
    let result = {
        textContainer: undefined,
        index: textContainers.length
    }

    textContainers.forEach((textContainer, index) => {
        if (textContainer.$.ref_id === idLayout) {
            result = {
                textContainer,
                index
            };
        }
    });
    return result;
}

function cloneArray(arr) {
    return arr.map((m) => {
        return {...m};
    });
}

function deletePagesContentInBook(pages, pagesChoosing) {
    let pagesResult = [...pages];
    for (let i in pagesChoosing) {
        let idPage = pagesChoosing[i] - 1;
        let page = pagesResult[idPage];

        if (Object.keys(page).length > 2) {
            const { page_layout_id, background_id } = page;
            let pageDefault = { page_layout_id, background_id };
            pagesResult[idPage] = pageDefault;
        }
    }
    return pagesResult;
}

function deletePagesListInBook(pages, pagesChoosing) {
    let pagesResult = [...pages];

    for (let i = pagesChoosing.length - 1; i >= 0; i--) {
        let idPage = pagesChoosing[i] - 1;
        pagesResult.splice(idPage, 1);
    }

    return pagesResult;
}

function parseSpansOfTextFlowToTextEditor(editorObject, spanArr) {
    for (let i in spanArr) {
        let textInSpan = '';
        let styleInSpan = {};
        let arrStyle = [];

        const span = spanArr[i];

        if (typeof span === 'string') {
            textInSpan = span;
        } else {
            if (span.$) {
                styleInSpan = span.$;
            }
            if (span._) {
                textInSpan = span._.toString();
            }
        }

        if (styleInSpan.fontWeight === 'bold') arrStyle.push('BOLD');
        if (styleInSpan.fontStyle === 'italic') arrStyle.push('ITALIC');
        if (styleInSpan.textDecoration === 'underline') arrStyle.push('UNDERLINE');
        if (styleInSpan.color) arrStyle.push(styleInSpan.color);
        if (styleInSpan.fontFamily) arrStyle.push('font_style-'+styleInSpan.fontFamily);
        if (styleInSpan.fontSize) arrStyle.push('size_style-'+styleInSpan.fontSize);

        editorObject.text = editorObject.text + textInSpan;
        let sizeCharacterList = Object.keys(editorObject.characterList).length;

        for (let j = 0; j < textInSpan.length; j++) {
            editorObject.characterList[sizeCharacterList+j] = {
                style: arrStyle,
                entity: null,
                char: textInSpan.charAt(j)
            };
        }
    }
}

function parseTextFlowToTextEditor(pArr) {
    let textEditorObject = {};

    pArr.forEach((p, index) => {
        let editorObject = {
            key: generateRandomKey(),
            text: '',
            type: 'unstyled',
            characterList: [],
            depth: 0,
            data: {}
        };

        if (p.span) {
            parseSpansOfTextFlowToTextEditor(editorObject, p.span);
        }

        textEditorObject[index] = editorObject;

        textEditorObject.alignment = 'left';
        if (p.$ && p.$.textAlign) textEditorObject.alignment = p.$.textAlign;
    });

    return textEditorObject;
}

export function parseTextSource(textSource) {
    if (!textSource) {
        return null;
    }
    
    let textFlowString = '';
    if (textSource.hasOwnProperty('_')) { textFlowString = textSource['_']; }
    if (textFlowString === '') { return null; }

    let parseString = require('xml2js').parseString;
    let textFlowObject = {};
    parseString(textFlowString, (err, result) => {
        if (result.hasOwnProperty('TextFlow')) {
            textFlowObject = result['TextFlow'];
        }
    });

    if (!textFlowObject.p) {
        return null;
    }

    return parseTextFlowToTextEditor(textFlowObject.p);
}

function deletePhotoHavingUsingInPages(pages, basePhotoId) {
    let newPages = [...pages];
    for (let i in newPages) {
        let imageContainer = newPages[i]['ImageContainer'];
        if (imageContainer) {
            for (let j in imageContainer) {
                if (imageContainer[j].Image &&
                    imageContainer[j].Image.image_source_id &&
                    imageContainer[j].Image.image_source_id === basePhotoId) {
                    delete imageContainer[j].Image;
                }
            }
        }
    }
    return newPages;
}

function getListImageIdFromLayout(layout) {
    let imgContainerIds = [];
    if (layout.ImageContainer) {
        for (let i in layout.ImageContainer) {
            imgContainerIds[i] = layout.ImageContainer[i].$.id;
        }
    }

    return imgContainerIds;
}

function getListTextIdFromLayout(layout) {
    let textContainerIds = [];
    if (layout.TextContainer) {
        for (let i in layout.TextContainer) {
            textContainerIds[i] = layout.TextContainer[i].$.id;
        }
    }

    return textContainerIds;
}

function removeDuplicateInArray(arr) {
    let uniq = new Set();

    arr.forEach(e => uniq.add(JSON.stringify(e)));

    let res = Array.from(uniq).map(e => JSON.parse(e));

    return res;
}

function getListImageFromContainer(container) {
    let listImage = [];
    for (let i in container) {
        if (container[i].Image) {
            let newImage = {
                fit_policy: 'fill',
                image_source_id: container[i].Image.image_source_id,
                rotation: 0,
                src: container[i].Image.src,
                x_shift: 0,
                y_shift: 0,
                zoom_level: '100'
            }
            listImage.push({Image: newImage});
        }
    }

    let resultList = removeDuplicateInArray(listImage);

    return resultList;
}

function getListTextFromContainer(container) {
    let listText = [];
    for (let i in container) {
        if (container[i].parsedText) {
            listText.push({parsedText: container[i].parsedText});
        }
    }

    let resultList = removeDuplicateInArray(listText);

    return resultList;
}

function makeNewImageContainer(imgContainerIds, pastImgContainerArr) {
    let imageContainers = [];
    // console.log("<<<<<<<<<<<<<<<<<<< abc", imageContainers, pastImgContainerArr);
    for (let i in imgContainerIds) {
        imageContainers[i] = {};
        let imageContainer = imageContainers[i];
        imageContainer.$ = {};
        imageContainer.$.ref_id = imgContainerIds[i];
        if (pastImgContainerArr[i] && pastImgContainerArr[i].Image) {
            let imageSource = {...pastImgContainerArr[i].Image};
            imageContainer.Image = {
                fit_policy: 'fill',
                image_source_id: imageSource.image_source_id,
                rotation: 0,
                src: imageSource.src,
                x_shift: 0,
                y_shift: 0,
                zoom_level: '100'
            }
        }
    }

    return imageContainers;
}

function makeNewTextContainer(textContainerIds, pastTextContainerArr) {
    let textContainers = [];

    for (let i in textContainerIds) {
        textContainers[i] = {};
        textContainers[i].$ = {};
        textContainers[i].$.ref_id = textContainerIds[i];
        if (pastTextContainerArr[i] && pastTextContainerArr[i].parsedText) {
            textContainers[i].parsedText = pastTextContainerArr[i].parsedText;
        }
    }

    return textContainers;
}

function changeAutoCreateLayoutForPage(page, newLayout, isRemoveContents=false) {
    page.page_layout_id = newLayout.$.id;

    if (isRemoveContents) {
        page.ImageContainer = undefined;
        page.TextContainer = undefined;
    } else {
        copyAutoCreateContentsOfPage(page, newLayout);
    }

    return page;
}

function copyAutoCreateContentsOfPage(page, newLayout) {
    let imgContainerIds = getListImageIdFromLayout(newLayout);
    let textContainerIds = getListTextIdFromLayout(newLayout);

    let pastImgContainerArr = [];
    if (page.ImageContainer) {
        pastImgContainerArr = getListImageFromContainer(page.ImageContainer);
    }

    let pastTextContainerArr = [];
    if (page.TextContainer) {
        pastTextContainerArr = getListTextFromContainer(page.TextContainer);
    }

    page.ImageContainer = makeNewImageContainer(imgContainerIds, pastImgContainerArr);
    page.TextContainer = makeNewTextContainer(textContainerIds, pastTextContainerArr);
}

function changeLayoutForPage(page, newLayout, isRemoveContents=false) {
    page.page_layout_id = newLayout.$.id;

    if (isRemoveContents) {
        page.ImageContainer = undefined;
        page.TextContainer = undefined;
    } else {
        copyContentsOfPage(page, newLayout);
    }

    return page;
}

function copyContentsOfPage(page, newLayout) {
    let imgContainerIds = getListImageIdFromLayout(newLayout);
    let textContainerIds = getListTextIdFromLayout(newLayout);
    let pastTextContainerArr = [];
    if (page.TextContainer) {
        pastTextContainerArr = getListTextFromContainer(page.TextContainer);
    }
    page.ImageContainer = makeNewImageContainer(imgContainerIds, page.imageList);
    page.TextContainer = makeNewTextContainer(textContainerIds, pastTextContainerArr);
}


function rearrangePages(pages, pagesChoosingList, position) {
    let newPages = [...pages];
    let amountPagesNeedToRearrange = pagesChoosingList.length;
    let pagesSelected = [];

    //get content pages in pagesChoosingList
    for (let i in pagesChoosingList) {
        pagesSelected.push(pages[pagesChoosingList[i] - 1]);
    }
   
    for (let i = amountPagesNeedToRearrange - 1; i >= 0; i--) {
        let positionOfPageNeedToDelete = pagesChoosingList[i] - 1;
        newPages.splice(positionOfPageNeedToDelete, 1);
    }

    for (let i = pagesSelected.length - 1; i >= 0; i--) {
        newPages.splice(position, 0, pagesSelected[i]);
    }
    return newPages;
}

function updateStyleOfText(text, style, enable) {
    for (let k in text.characterList) {
        let styleList = text.characterList[k].style;
        let indexOfStyle = styleList.indexOf(style);
        if (indexOfStyle !== -1) {
            if (enable) continue;
            else styleList.splice(indexOfStyle, 1);
        } else {
            if (enable) {
                if(style.indexOf('font_style-')===0) {
                    for (let i in styleList) {
                        if(styleList[i].indexOf('font_style-')===0) styleList.splice(i, 1);
                    }
                } else if(style.indexOf('size_style-')===0) {
                    for (let i in styleList) {
                        if(styleList[i].indexOf('size_style-')===0) styleList.splice(i, 1);
                    }
                } else if(style.indexOf('#')===0) {
                    for (let i in styleList) {
                        if(styleList[i].indexOf('#')===0) styleList.splice(i, 1);
                    }
                }
                styleList.push(style);
            }
            else continue;
        }
    }
}

function updateTextStyleOfContainer(container, style, enable) {
    let text = container.parsedText;
    for (let i in text) {
        if (style.indexOf('alignment-')===0) {
            let alignment = style.split('-')[1];
            if (enable) {
                text.alignment = alignment;
            } else text.alignment = 'left';
        } else updateStyleOfText(text[i], style, enable);
    }
}

function updateTextStyleOfPage(page, style, enable) {
    if (page.TextContainer) {
        for (let j in page.TextContainer) {
            let container = page.TextContainer[j];
            if (!container.parsedText) continue;
            updateTextStyleOfContainer(container, style, enable);
        }
    }
}

function updateTextStyleOfPages(pages, {style, enable, pagesChoosingList}) {
    let newPages = [...pages];
    for (let i in pagesChoosingList) {
        let pageNumber = pagesChoosingList[i] - 1;
        let page = newPages[pageNumber];
        updateTextStyleOfPage(page, style, enable);
    }

    return newPages;
}

function changeBackgroundForPage(pages, {pagePosition, backgroundId}) {
    pages[pagePosition].background_id = backgroundId;
    return pages;
}

function changeBackgroundForAllPages(pages, {backgroundId}){
    for (let index = 0; index < pages.length; index++) {
        pages[index].background_id = backgroundId;
    }
    return pages;
}

export default undoable(pageReducer, {limit:Config.instance.maxUndo});
