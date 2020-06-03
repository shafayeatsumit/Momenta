import _ from 'lodash';
export const getProgress = (index, allContents) => {
  if (index === null || allContents.length === 0) {
    return;
  }
  const content = allContents[index];
  const filterBySet = allContents.filter((item) => item.set === content.set);
  const uniqueContentIds = uniq(filterBySet.map((item) => item.id));
  const currentIndex = uniqueContentIds.findIndex(
    (item) => item === content.id,
  );
  return {
    totalInTheSet: uniqueContentIds.length,
    currentIndex: currentIndex + 1,
  };
};

export const getCategory = (index, allContents) => {
  if (index === null || allContents.length === 0) {
    return;
  }
  return _.get(allContents[index], 'tag');
};

export const getBookmark = (index, allContents) => {
  if (index === null || allContents.length === 0) {
    return;
  }
  return _.get(allContents[index], 'isBookmark');
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const arrayToQueryParams = (key, values) => {
  let queryString = values.map(
    (item) => key + '=' + item.replace(/ /g, '%20') + '&',
  );
  queryString = queryString.join('');
  // remove last occurrance of &, and add ? at the beginning
  queryString = '?' + queryString.substring(0, queryString.length - 1);
  return queryString;
};

export const bookmarkParser = (responseData) => {
  const sets = responseData.map((item) => {
    const tagName = item.set.tags[0].name;
    const contents = item.set.contents;
    return contents.map((content) => ({
      ...content,
      tag: tagName,
      isBookmark: true,
      setId: `${tagName}_${content.set}`,
    }));
  });
  return _.flatten(sets);
};

export const contentParser = (responseData) => {
  let contents = responseData.map((set) => {
    return set.contents.map((content) => ({
      ...content,
      isBookmark: set.isBookmark,
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

export const filterSets = (array) => {
  return array.filter(function (item, pos, arr) {
    // Always keep the 0th element as there is nothing before it
    // Then check if each element is different than the one before it
    return pos === 0 || item !== arr[pos - 1];
  });
};

export const getURLExtension = (url) =>
  url.split(/[#?]/)[0].split('.').pop().trim();
