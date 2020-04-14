import _ from 'lodash';
export const getProgress = (index, allContents) => {
  if (index === null || allContents.length === 0) {
    return;
  }
  const content = allContents[index];
  const filterBySet = allContents.filter(
    (item) => item.setId === content.setId,
  );
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
  return _.get(allContents[index], 'category');
};
