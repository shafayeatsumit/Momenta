import _ from 'lodash';
import DEFAULT_CATEGORIES from '../../helpers/constants/categories';

const initialState = {
  items: DEFAULT_CATEGORIES,
  multiselectMode: false,
};

const findMaxOrderId = (categories) => {
  return _.maxBy(categories, (item) => item.orderId).orderId;
};

const adjustOrder = (categories, selectedId) => {
  const maxId = findMaxOrderId(categories);
  return categories.map((item) => {
    if (item.id === selectedId) {
      if (item.orderId > 0) {
        return {
          ...item,
          orderId: 0,
        };
      } else {
        return {
          ...item,
          orderId: maxId + 1,
        };
      }
    }
    return item;
  });
};

const categories = (state = initialState, action) => {
  let updatedItems;
  switch (action.type) {
    case 'TOOGLE_CATEGORY':
      const {id} = action.payload;
      updatedItems = adjustOrder(state.items, id);
      return {
        ...state,
        items: updatedItems,
      };
    case 'MULTI_SELECT_MODE':
      return {
        ...state,
        multiselectMode: true,
      };
    case 'CACEL_MULTI_SELECT_MODE':
      return initialState;
    default:
      return state;
  }
};

export default categories;
