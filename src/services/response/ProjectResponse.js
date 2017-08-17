class ProjectResponse {

  code = 200;
  project = null;

  constructor(code, project) {
    let metadata = project.metadata[0];
    this.code = code;
    this.project = { id: project.id[0],
                    'product-id': project['product-id'][0],
                    metadata: { source_name: metadata.source_name[0],
                                title: metadata.title[0],
                                version: metadata.version[0],
                                restartapponsave: metadata.restartapponsave[0],
                                instant_book: metadata.instant_book[0],
                                source_info: metadata.source_info[0],
                                editlitemode: metadata.editlitemode[0],
                                apiversion: metadata.apiversion[0],
                                size: metadata.size[0],
                                'date-uploaded': metadata['date-uploaded'][0],
                                'created-at': metadata['created-at'][0]
                              }
                    };
  }
}

export default ProjectResponse;
