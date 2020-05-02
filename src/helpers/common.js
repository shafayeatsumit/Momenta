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
