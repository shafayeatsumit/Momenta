import DEFAULT_DATA from '../../helpers/constants/tempdata';

const findNextSetIndex = (state) => {
  const {activeIndex, allContents} = state;
  let nextIndex = null;
  for (let i = activeIndex + 1; i < allContents.length; i++) {
    const elem = allContents[activeIndex];
    if (elem.setId !== allContents[i].setId) {
      nextIndex = i;
      break;
    }
  }

  return nextIndex;
};

const INIT_STATE = {
  allContents: [],
  activeIndex: null,
};

const contents = (state = INIT_STATE, action) => {
  let updatedIndex;
  switch (action.type) {
    case 'ADD_CONTENT':
      updatedIndex = state.activeIndex === null ? 0 : state.activeIndex;
      return {
        ...state,
        allContents: [...state.allContents, ...DEFAULT_DATA],
        activeIndex: updatedIndex,
      };
    case 'NEXT_CONTENT':
      updatedIndex = state.activeIndex === null ? 0 : state.activeIndex + 1;
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
    default:
      return state;
  }
};

export default contents;
