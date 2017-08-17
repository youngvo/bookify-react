import {
    SET_PROJECT_INFO,
    SET_PROJECT_ID
} from './../../actions/projectActions/ProjectInfoActions';

import { metadataConstants } from './../../constants/Constants';

let projectInfoDefault = {
    id: '',
    productId: '',
    isProjectSaving: false,
    hasStrippedXML: false,
    coverThumbnail: '',
    designerBook: '',
    yearBook: '',
    metadata: {
        version: 1,
        apiversion: '',
        size: '',
        title: '',
        restartapponsave: false,
        'date-uploaded': '',
        'created-at': '',
        'updated-at': '',
        source_name: '',
        source_info: '',
        instant_book: '',
        editlitemode: false,
    },
    editLiteModeSet: false,
    chickenSoup: '',
    chickenSoupTitle: '',
    chickenSoupVolume: ''
};

function mapFunctions(projectInfo) {
    projectInfo.get_source_name = () => {
        if (!projectInfo.sourceName) {
            projectInfo.sourceName = metadataConstants.SOURCENAME_BOOKIFY;
        }
        return projectInfo.sourceName;
    };

    projectInfo.get_source_info = () => {
        let isBookify = projectInfo.getSourceName === metadataConstants.SOURCENAME_BOOKIFY;

        // save source_info for designerbook/instantbook in the form "designerbook=amsterdam" or "instantbook=facebook", etc.
        // It is in this form to be consistent with the rest of the backend
        if (isBookify && projectInfo.isDesignerBook()) {
            projectInfo.sourceInfo = 'designerbook=' + projectInfo.designerBook;
            return projectInfo.sourceInfo;
        }
        if (isBookify && projectInfo.isYearBook()) {
            projectInfo.sourceInfo = 'yearbook=' + projectInfo.yearBook;
            return projectInfo.sourceInfo;
        }
        if (isBookify && projectInfo.isInstantBook()) {
            projectInfo.sourceInfo = 'instantbook=' + projectInfo.instantBook();
            return projectInfo.sourceInfo;
        }
        if (isBookify && projectInfo.isChickenSoup()) {
            projectInfo.sourceInfo = 'chickensoup=' + projectInfo.chickenSoup;
            return projectInfo.sourceInfo;
        }

        return projectInfo.sourceInfo;
    };

    projectInfo.get_instant_book = () => {
        // we need to overload the instant_book property with designerbook info
        // so that analytics continue to work without having to make any changes on their side (aka consume resources)
        if (projectInfo.designerBook && projectInfo.designerBook.length > 0) {
            return 'designerbook_' + projectInfo.designerBook;
        }
        else if (projectInfo.yearBook && projectInfo.yearBook.length > 0) {
            return projectInfo.yearBook;
        }

        return projectInfo.instant_book;
    };

    projectInfo.instantBook = () => {
        let designerBook = projectInfo.designerBook;
        let yearbook = projectInfo.yearBook;
        let instant_book = projectInfo.get_instant_book();

        if ((!designerBook || designerBook.length <= 0) && (!yearbook || yearbook.length <= 0)) {
            return instant_book ? instant_book : projectInfo.metadata.instantBook;
        }
        else {
            return '';
        }
    };

    projectInfo.isInstantBook = () => {
        let instantBook = projectInfo.instantBook();
        return instantBook && instantBook.length > 0;
    };

    projectInfo.getEditLiteMode = () => {
        if (!projectInfo.editLiteModeSet && projectInfo.metadata)
        {
            return projectInfo.metadata.editLiteMode;
        }

        return projectInfo.editLiteMode;
    };

    projectInfo.isDesignerBook = () => {
        return projectInfo.designerBook && projectInfo.designerBook.length > 0;
    };

    projectInfo.isYearBook = () => {
        return projectInfo.yearBook && projectInfo.yearBook.length > 0;
    };

    projectInfo.getYearbookThemeName = () => {
        return projectInfo.yearBook.split('_').pop();
    };

    projectInfo.isChickenSoup = () => {
        return projectInfo.chickenSoup && projectInfo.chickenSoup.length > 0;
    };

    projectInfo.isChickenSoupSympathy = () => {
        return projectInfo.isChickenSoup() && projectInfo.chickenSoupTitle.toLowerCase() === 'sympathy';
    };

    projectInfo.chickenSoupStarterBook = () => {
        return 'square_chickensoup_' + projectInfo.chickenSoupTitle + '_' + projectInfo.chickenSoupVolume;
    };

    projectInfo.toXML = () => {
        let parser = new DOMParser();
        let xmlTagString = '<metadata></metadata>';
        let xmlProInfoDocument = parser.parseFromString(xmlTagString, 'text/xml');

        let metaDataXML = xmlProInfoDocument.getElementsByTagName('metadata')[0];
        //let metaDataTag = xmlProInfoDocument.createElement('metadata');

        for (let key in projectInfo.metadata) {
            let newTag = xmlProInfoDocument.createElement(key);
            newTag.innerHTML = projectInfo.metadata[key].toString();
            metaDataXML.appendChild(newTag);
        }

        return metaDataXML;
    };

    projectInfo.toXMLString = () => {
        let projectInfoXML = projectInfo.toXML();
        return (new XMLSerializer()).serializeToString(projectInfoXML);
    };
}

export default function projectInfoReducer(projectInfo = projectInfoDefault, action) {
    let projectInfoResult;

    switch (action.type) {
        case SET_PROJECT_INFO:
            projectInfoResult = handleGetProjectInfo(projectInfo, action.payload);
            break;
        case SET_PROJECT_ID:
            projectInfoResult = handleSetProjectId(projectInfo, action);
            break;
        default: 
            projectInfoResult = projectInfo;
    }

    mapFunctions(projectInfoResult);
    return projectInfoResult;
};

function handleGetProjectInfo(projectInfo, { projectInfoJson }) {
    let result = {...projectInfo};
    
    result.metadata = projectInfoJson.metadata;
    result.id = projectInfoJson.id;
    result.productId = projectInfoJson['product-id'];

    return result;
}

function handleSetProjectId(projectInfo, action) {
    return {
        ...projectInfo,
        projectId: action.projectId
    };
}
