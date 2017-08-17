const PRE_FIX = 'projectInfo/';
export const SET_PROJECT_INFO = PRE_FIX + 'SET_PROJECT_INFO';
export const SET_PROJECT_ID = PRE_FIX + 'SET_PROJECT_ID';

export function setProjectInfo(projectInfoJson) {
    return {
        type: SET_PROJECT_INFO,
        payload: {
            projectInfoJson
        }
    };
}

export function projectAct_setProjectId(projectId) {
    return {
        type: SET_PROJECT_ID,
        payload: {
            projectId
        }
    };
}
