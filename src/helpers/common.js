import _ from 'lodash';
export const getProgress = (index, allContents) => {
  if (index === null || allContents.length === 0) {
    return;
  }
  const content = allContents[index];
  const filterBySet = allContents.filter((item) => item.set === content.set);
  const currentIndex = filterBySet.findIndex((item) => item.id === content.id);
  return {
    totalInTheSet: filterBySet.length,
    currentIndex: currentIndex + 1,
  };
};

export const getCategory = (index, allContents) => {
  if (index === null || allContents.length === 0) {
    return;
  }
  return _.get(allContents[index], 'tag');
};

export const arrayToQueryParams = (key, values) => {
  let queryString = values.map((item) => key + '=' + item + '&');
  queryString = queryString.join('');
  // remove last occurrance of &, and add ? at the beginning
  queryString = '?' + queryString.substring(0, queryString.length - 1);
  return queryString;
};

export const contentParser = (responseData) => {
  let contents = responseData.map((set) => {
    return set.contents.map((content) => ({
      ...content,
      tag: set.tags[0].name,
    }));
  });
  return _.flatten(contents);
};

export const uniq = (array) => [...new Set(array)];
export function arraysEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export const findNextSetIndex = (activeIndex, allContents) => {
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
