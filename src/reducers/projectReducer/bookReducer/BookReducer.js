import bookInfoReducer from './BookInfoReducer';
import bookMetaDataReducer from './BookMetaDataReducer';
import pagesReducer from './pagesReducer/PagesReducer';
import coversReducer from './CoversReducer';
import layoutsReducer from './LayoutsReducer';
import recentLayoutsReducer from './RecentLayoutsReducer';

let bookDefault = {
    // bookInfo: {},
    // bookMetaData: {},
    // pages: [],
    // covers: {},
    // layouts: []
};

function setAttributesFor(element, attributeObject) {
    for (let i in attributeObject) {
        element.setAttribute(i.toString(), attributeObject[i]);
    }
}

function isDifferentStyle(style1, style2) {
    if (!style1 || !style2) return true;
    return (JSON.stringify(style1) !== JSON.stringify(style2));
}

function setAttributesForSpanElement(spanElement, styles) {
    let spanAttributes = {
        alignmentBaseline: 'useDominantBaseline',
        backgroundAlpha: '1',
        backgroundColor: 'transparent',
        baselineShift: '0',
        breakOpportunity: 'auto',
        cffHinting: 'horizontalStem',
        color: '#e32b3a',
        digitCase: 'default',
        digitWidth: 'default',
        dominantBaseline: 'auto',
        fontFamily: 'Helvetica LT 55 Roman',
        fontLookup: 'embeddedCFF',
        fontSize: '28',
        fontStyle: 'normal',
        fontWeight: 'normal',
        kerning: 'auto',
        ligatureLevel: 'common',
        lineHeight: '120%',
        lineThrough: 'false',
        locale: 'en',
        renderingMode: 'cff',
        textAlpha: '1',
        textDecoration: 'none',
        textRotation: 'auto',
        trackingLeft: '0',
        trackingRight: '0',
        typographicCase: 'default'
    };

    for (let i in styles) {
        let style = styles[i];
        if (style === 'BOLD') spanAttributes.fontWeight = 'bold';
        if (style === 'ITALIC') spanAttributes.fontStyle = 'italic';
        if (style === 'UNDERLINE') spanAttributes.textDecoration = 'underline';
        if (style.indexOf('#') !== -1) spanAttributes.color = style;
        if (style.indexOf('font_style-') !== -1) spanAttributes.fontFamily = style.split('-')[1];
        if (style.indexOf('size_style-') !== -1) spanAttributes.fontSize = style.split('-')[1];
    }

    setAttributesFor(spanElement, spanAttributes);
}

function setTextAndAttributesForSpanElement(spanElement, textInSpan, styleInSpan, document) {
    let textNode = document.createTextNode(textInSpan);
    spanElement.appendChild(textNode);

    if (styleInSpan.length === 0) return;

    setAttributesForSpanElement(spanElement, styleInSpan);
}

function setAttributesForPElement(pElement, alignment) {
    let pAttributes = {
        direction: 'ltr',
        justificationRule: 'auto',
        justificationStyle: 'auto',
        leadingModel: 'romanUp',
        paragraphEndIndent: '0',
        paragraphSpaceAfter: '0',
        paragraphSpaceBefore: '0',
        paragraphStartIndent: '0',
        textAlign: alignment,
        textAlignLast: 'start',
        textIndent: '0',
        textJustify: 'interWord'
    };

    setAttributesFor(pElement, pAttributes);
}

function parseEditorObjectToPElement(editorObject, alignment, document) {
    let pElement = document.createElement('p');

    if (editorObject.characterList.length === 0) {
        setAttributesForPElement(pElement, alignment);
    } else {
        let spanElement = null;
        let textInSpan = '';
        let preStyleInSpan = null;

        for (let i in editorObject.characterList) {
            let charObject = editorObject.characterList[i];

            if (isDifferentStyle(charObject.style, preStyleInSpan)) {
                if (spanElement) {
                    setTextAndAttributesForSpanElement(spanElement, textInSpan, preStyleInSpan, document);
                    pElement.appendChild(spanElement);
                }

                spanElement = document.createElement('span');
                textInSpan = charObject.char;
                preStyleInSpan = charObject.style;
            } else {
                textInSpan += charObject.char;
            }
        }
        if (spanElement) {
            setTextAndAttributesForSpanElement(spanElement, textInSpan, preStyleInSpan, document);
            pElement.appendChild(spanElement);
        }
        if (preStyleInSpan) {
            setAttributesForPElement(pElement, alignment);
        }
    }

    return pElement;
}

function parseTextEditorObjectToTextFlowString(textEditorObject, document) {
    let textFlowElement = document.createElement('TextFlow');

    let textFlowAttributes = {
        color: '#000000',
        fontFamily: 'Helvetica LT 55 Roman',
        fontLookup: 'embeddedCFF',
        fontSize: '14',
        fontStyle: 'normal',
        fontWeight: 'normal',
        leadingModel: 'romanUp',
        lineHeight: '120%',
        paragraphEndIndent: '0',
        paragraphSpaceAfter: '0',
        paragraphSpaceBefore: '0',
        paragraphStartIndent: '0',
        textAlign: 'left',
        textDecoration: 'none',
        verticalAlign: 'top',
        whiteSpaceCollapse: 'preserve',
        xmlns: 'http://ns.adobe.com/textLayout/2008'
    };

    setAttributesFor(textFlowElement, textFlowAttributes);

    for (let i in textEditorObject) {
        if (i === 'alignment') continue;

        const pElement = parseEditorObjectToPElement(textEditorObject[i], textEditorObject.alignment, document);
        
        textFlowElement.appendChild(pElement);
    }

    return (new XMLSerializer()).serializeToString(textFlowElement);
}

function textEditorObjectToTextElement(textEditorObject, document) {
    let textElement = document.createElement('Text');

    let textAttributes = {
        bindingAllowed: 'true',
        color: '#000000',
        fontFamily: 'Helvetica LT 55 Roman',
        fontSize: '14'
    };

    setAttributesFor(textElement, textAttributes);

    let stringText = '<![CDATA[' + parseTextEditorObjectToTextFlowString(textEditorObject, document) + ']]>';
    let textNode = document.createTextNode(stringText);
    textElement.appendChild(textNode);

    return textElement;
}

function createBookMetaDataTagFrom(bookMetaData, xmlBookDocument) {
    let bookMetaDataElement = xmlBookDocument.createElement('BookMetaData');

    for (let key in bookMetaData) {
        if (bookMetaData[key] === undefined) continue;
        let newTag = xmlBookDocument.createElement(capitalizeFirstLetter(key));
        let textNode = xmlBookDocument.createTextNode(bookMetaData[key]);
        newTag.appendChild(textNode);
        bookMetaDataElement.appendChild(newTag);
    }

    return bookMetaDataElement;
}

function createLayoutsTagFrom(layouts, xmlBookDocument) {
    let layoutsTag = xmlBookDocument.createElement('Layouts');
    //------------- add page layouts -------------
    if (layouts.hasOwnProperty('PageLayout')) {
        let pageLayoutsTag = xmlBookDocument.createElement('PageLayouts');
        let pageLayoutArray = layouts.PageLayout;
        for (let index in pageLayoutArray) {
            let newTag = xmlBookDocument.createElement('PageLayout');
            for (let key in pageLayoutArray[index]) {
                if(key === '$') {
                    newTag.setAttribute('id', pageLayoutArray[index].$.id);
                    newTag.setAttribute('width', pageLayoutArray[index].$.width);
                    newTag.setAttribute('height', pageLayoutArray[index].$.height);
                } else {
                    let newChildTag = xmlBookDocument.createElement(key);
                    for ( let childKey in pageLayoutArray[index][key][0]['$']) {
                        newChildTag.setAttribute(childKey, pageLayoutArray[index][key][0]['$'][childKey]);
                        newTag.appendChild(newChildTag);
                    }
                }
                pageLayoutsTag.appendChild(newTag);
            }
        }
        layoutsTag.appendChild(pageLayoutsTag);
    }
    //------------- add cover layouts ------------
    if (layouts.hasOwnProperty('CoverLayout')) {
        let coverLayoutsTag = xmlBookDocument.createElement('CoverLayouts');
        let coverLayoutArray = layouts.CoverLayout;
        for (let index in coverLayoutArray) {
            let newTag = xmlBookDocument.createElement('CoverLayout');
            for (let key in coverLayoutArray[index]) {
                if(key === '$') {
                    newTag.setAttribute('id', coverLayoutArray[index].$.id);
                    newTag.setAttribute('width', coverLayoutArray[index].$.width);
                    newTag.setAttribute('height', coverLayoutArray[index].$.height);
                } else {
                    let newChildTag = xmlBookDocument.createElement(key);
                    for ( let childKey in coverLayoutArray[index][key][0]['$']) {
                        newChildTag.setAttribute(childKey, coverLayoutArray[index][key][0]['$'][childKey]);
                        newTag.appendChild(newChildTag);
                    }
                }
                coverLayoutsTag.appendChild(newTag);
            }
        }
        layoutsTag.appendChild(coverLayoutsTag);
    }

    return layoutsTag;
}

function createImageContainerTagFrom(imageContainer, photoId, photoImageUrl, xmlBookDocument) {
    let imageContainerTag = xmlBookDocument.createElement('ImageContainer');

    if (imageContainer.Image) {
        let imageTag = xmlBookDocument.createElement('Image');

        for (let childKey in imageContainer.Image) {
            if (childKey === 'image_source_id') {
                imageTag.setAttribute(childKey, photoId);
            } else if (childKey === 'src') {
                imageTag.setAttribute(childKey, photoImageUrl);
            } else {
                imageTag.setAttribute(childKey, imageContainer.Image[childKey]);
            }
        }

        imageContainerTag.appendChild(imageTag);
    }

    for (let j in imageContainer) {
        if (j !=='Image' && j!=='$') {
            imageContainerTag.setAttribute(j, imageContainer[j]);
        }

        if (j === '$') {
            for (let k in imageContainer['$']) {
                imageContainerTag.setAttribute(k, imageContainer['$'][k]);
            }
        }
    }

    return imageContainerTag;
}

function createPagesTagFrom(pages, photoList, xmlBookDocument) {
    let pagesTag = xmlBookDocument.createElement('Pages');

    for (let index in pages) {
        let pageTag = xmlBookDocument.createElement('Page');
        let page = pages[index];

        if (page.ImageContainer) {
            for (let i in page.ImageContainer) {
                let imageContainer = page.ImageContainer[i];

                if (!imageContainer.Image) continue;

                let photo = photoList[imageContainer.Image.image_source_id];
                if (!photo || photo.id === '' || !photo.imageUrl.indexOf(photo.id)) {
                    continue;
                }

                // imageContainer.Image.image_source_id = photo.id;
                // imageContainer.Image.src = photo.imageUrl;

                const imageContainerTag = createImageContainerTagFrom(imageContainer, photo.id, photo.imageUrl, xmlBookDocument);
                pageTag.appendChild(imageContainerTag);
            }
        }

        for (let key in page) {
            if (key === 'background_id' || key === 'page_layout_id' || key === 'background_color' || key === 'can_change_layouts') {
                pageTag.setAttribute(key, page[key]);
            }


            if (key === 'TextContainer') {
                for ( let i in page['TextContainer'] ) {
                    let newTag = xmlBookDocument.createElement('TextContainer');
                    let textContainer = page['TextContainer'][i];
                    if (textContainer.parsedText) {

                        // let newChildTextTag = xmlBookDocument.createElement('Text');
                        // console.log('textContainer::::', textContainer)
                        // let stringText = '<![CDATA[' + textContainer.text + ']]>';
                        // let textNode = xmlBookDocument.createTextNode(stringText);
                        // newChildTextTag.appendChild(textNode);

                        let textElement = textEditorObjectToTextElement(textContainer.parsedText, xmlBookDocument);
                        newTag.appendChild(textElement);

                        console.log('textElement ', textElement);

                        let newChildParseTextTag = xmlBookDocument.createElement('ParsedText');
                        let stringParseText =  textContainer.parsedText ? JSON.stringify(textContainer.parsedText) : '';
                        let parseTextNode = xmlBookDocument.createTextNode(stringParseText);
                        newChildParseTextTag.appendChild(parseTextNode);
                        newTag.appendChild(newChildParseTextTag);
                    }
                    for (let j in textContainer) {
                        if ( j!=='text' &&  j!=='$') {
                            newTag.setAttribute(j, textContainer[j])
                        }
                        if (j==='$') {
                            for ( let k in textContainer['$'] ) {
                                newTag.setAttribute(k, textContainer['$'][k])
                            }
                        }
                    }
                    pageTag.appendChild(newTag);
                }
            }
        }

        pagesTag.appendChild(pageTag);
    }

    return pagesTag;
}

function createCoversTagFrom(covers, xmlBookDocument) {
    let coversTag = xmlBookDocument.createElement('Covers');
    let coverTag = xmlBookDocument.createElement('Cover');
    for ( let key in covers ) {
        if (key==='coverInfo') {
            for (let childKey in covers['coverInfo']) {
                coverTag.setAttribute(childKey, covers['coverInfo'][childKey]);
            }
        } else {
            let typeCoverTag = xmlBookDocument.createElement(capitalizeFirstLetter(key));
            for ( let childKey in covers[key]) {
                typeCoverTag.setAttribute(childKey, covers[key][childKey]);
            }
            coverTag.appendChild(typeCoverTag);
        }
    }

    coversTag.appendChild(coverTag);

    return coversTag;
}

function createContentsTagFrom(pages, covers, photoList, xmlBookDocument) {
    let contentTag = xmlBookDocument.createElement('Contents');
    let pagesTag = createPagesTagFrom(pages, photoList, xmlBookDocument);
    let coversTag = createCoversTagFrom(covers, xmlBookDocument);
    contentTag.appendChild(coversTag);
    contentTag.appendChild(pagesTag);

    return contentTag;
}

function createCreatedContextTag(xmlBookDocument) {
    let createdContextTag = xmlBookDocument.createElement('created_context');
    let textNode = xmlBookDocument.createTextNode('bookify-react');
    createdContextTag.appendChild(textNode);

    return createdContextTag;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function mapFunctions(book) {
    book.toBBFXml = (photoList) => {
        let { bookInfo, bookMetaData, covers, layouts } = book;
        let pages = book.pages.present;

        let parser = new DOMParser();
        let xmlTagString = '<Book></Book>';
        let xmlBookDocument = parser.parseFromString(xmlTagString, 'text/xml');
        let bookXML = xmlBookDocument.getElementsByTagName('Book')[0];

        bookXML.setAttribute('format', bookInfo.format);
        bookXML.setAttribute('theme', bookInfo.theme);
        bookXML.setAttribute('schema_version', bookInfo.schema_version);

        let bookMetaDataTag = createBookMetaDataTagFrom(bookMetaData, xmlBookDocument);
        let layoutsTag = createLayoutsTagFrom(layouts, xmlBookDocument);
        let contentsTag = createContentsTagFrom(pages, covers, photoList, xmlBookDocument);

        bookXML.appendChild(bookMetaDataTag);
        bookXML.appendChild(layoutsTag);
        bookXML.appendChild(contentsTag);

        return bookXML;
    };

    book.toBBFXmlString = (photoList) => {
        let bookXML = book.toBBFXml(photoList);
        return (new XMLSerializer()).serializeToString(bookXML);
    };
}

export default function bookReducer(book = bookDefault, action) {
    let bookResult = {
        bookInfo: bookInfoReducer(book.bookInfo, action),
        bookMetaData: bookMetaDataReducer(book.bookMetaData, action),
        pages: pagesReducer(book.pages, action),
        covers: coversReducer(book.covers, action),
        layouts: layoutsReducer(book.layouts, action),
        recentLayouts: recentLayoutsReducer(book.recentLayouts, action)
    };
    mapFunctions(bookResult);
    return bookResult;
};
