const findNextSetIndex = (state) => {
  const {activeIndex, allContents} = state;
  let nextIndex = null;
  for (let i = activeIndex + 1; i < allContents.length; i++) {
    const elem = allContents[activeIndex];
    if (elem && elem.set !== allContents[i].set) {
      nextIndex = i;
      break;
    }
  }
  return nextIndex;
};

const INIT_STATE = {
  allContents: [],
  activeIndex: null,
  minimized: false,
};

const contents = (state = INIT_STATE, action) => {
  let updatedIndex, updatedContents;
  switch (action.type) {
    case 'ADD_CONTENT':
      updatedIndex = state.activeIndex === null ? 0 : state.activeIndex;
      return {
        ...state,
        allContents: [...state.allContents, ...action.data],
        activeIndex: updatedIndex,
        minimized: false,
      };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        allContents: action.updatedContents,
      };
    case 'ADD_BOOKMARK':
      updatedContents = state.allContents.map((item) =>
        item.set === action.set ? {...item, isBookmark: true} : item,
      );
      return {
        ...state,
        allContents: updatedContents,
      };
    case 'DELETE_BOOKMARK':
      updatedContents = state.allContents.map((item) =>
        item.set === action.set ? {...item, bookmark: false} : item,
      );
      return {
        ...state,
        allContents: updatedContents,
      };
    case 'NEXT_CONTENT':
      updatedIndex =
        state.activeIndex < state.allContents.length
          ? state.activeIndex + 1
          : state.activeIndex;
      return {
        ...state,
        activeIndex: updatedIndex,
      };
    case 'PREVIOUS_CONTENT':
      updatedIndex = state.activeIndex ? state.activeIndex - 1 : 0;
      return {
        ...state,
        activeIndex: updatedIndex,
      };
    case 'GO_TO_NEXT_SET':
      const nextIndex = findNextSetIndex(state);
      return {
        ...state,
        activeIndex: nextIndex,
      };
    case 'MINIMIZE_CONTENT':
      return {
        ...state,
        minimized: true,
      };
    case 'RESET_CATEGORIES_CONTENT':
    case 'CHOOSE_SINGLE_TAG':
    case 'RESET_CONTENT':
      return {
        ...state,
        ...INIT_STATE,
      };
    default:
      return state;
  }
};

export default contents;
