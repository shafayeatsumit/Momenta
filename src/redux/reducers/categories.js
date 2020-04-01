import DEFAULT_CATEGORIES from '../../helpers/constants/categories';

const categories = (state = DEFAULT_CATEGORIES, action) => {
  switch (action.type) {
    case 'TOOGLE_CATEGORY':
      const {id} = action.payload;
      return state.map((item) =>
        item.id === id ? {...item, selected: !item.selected} : item,
      );
    default:
      return state;
  }
};

export default categories;
