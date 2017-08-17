import { SET_THEMES } from './../../actions/themesActions/ThemesActions';

let themesDefault = {};
export default function themesReducer(themes = themesDefault, action) {
    switch (action.type) {
        case SET_THEMES:
            return handleSetThemes(action.payload);
        default: return themes;
    }
};

function handleSetThemes({ themes }) {
    return themes;
}