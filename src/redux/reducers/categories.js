import DEFAULT_CATEGORIES from '../../helpers/constants/categories';

const initialState = {
  items: DEFAULT_CATEGORIES,
  multiselectMode: false,
  selected: [],
};
const categories = (state = initialState, action) => {
  switch (action.type) {
    case 'TOOGLE_SELECTED_TAG':
      return {
        ...state,
        selected: action.selectedTags,
      };
    case 'MULTI_SELECT_MODE':
      return {
        ...state,
        multiselectMode: true,
      };
    case 'CHOOSE_SINGLE_TAG':
      return {
        ...state,
        multiselectMode: false,
        selected: [action.id],
      };
    case 'START_FROM_SPECIFIC_BOOKMARK_SET':
    case 'RESET_CATEGORIES_CONTENT':
    case 'RESET_CATEGORIES':
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
};

export default categories;
