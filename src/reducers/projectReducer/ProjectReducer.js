import projectInfoReducer from './ProjectInfoReducer';
import bookReducer from './bookReducer/BookReducer';

let projectDefault = {
    //projectInfo: {},
    // book: {}

};

function mapFunctions(project) {
    project.toXML = () => {
        let parser = new DOMParser();
        let xmlTagString = '<response></response>';
        let xmlDocument = parser.parseFromString(xmlTagString, 'text/xml');

        let responseXML = xmlDocument.getElementsByTagName('response')[0];
        //let responseTag = xmlDocument.createElement('response');
        responseXML.setAttribute("code", "200");

        let bookXML = xmlDocument.createElement("Book");
        let bookXMLData = project.book.toBBFXml();
        if (bookXMLData && bookXMLData.firstChild !== null) {
            bookXML = bookXMLData.firstChild;
        }

        let projectInfoXML = project.projectInfo.toXML();
        let projectTag = xmlDocument.createElement("project");
        projectTag.appendChild(projectInfoXML.firstChild);

        let idTag = xmlDocument.createElement("id");
        if(project.projectInfo.hasOwnProperty("id")) idTag.innerHTML = project.projectInfo.id.toString();
        projectTag.appendChild(idTag);

        let productIdTag = xmlDocument.createElement("product-id");
        if(project.projectInfo.hasOwnProperty("productId")) productIdTag.innerHTML = project.projectInfo.productId.toString();
        projectTag.appendChild(productIdTag);

        let dataTag = xmlDocument.createElement("data");
        dataTag.appendChild(bookXML);
        projectTag.appendChild(dataTag);

        responseXML.appendChild(projectTag);

        return responseXML;
    };

    project.toXMLString = () => {
        let projectXML = project.toXML();
        return (new XMLSerializer()).serializeToString(projectXML);
    };
}

export default function projectReducer(project = projectDefault, action) {
    let projectResult = {
        projectInfo: projectInfoReducer(project.projectInfo, action),
        book: bookReducer(project.book, action)
    };

    //mapFunctions(projectResult);
    return projectResult;
};
