import _ from 'lodash';

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffleArray(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const shuffleBookmarks = (bookmarks) => {
  const groupBookmarksBySet = _.groupBy(bookmarks, (item) => item.set);
  let bookmarkSets = Object.keys(groupBookmarksBySet);
  bookmarkSets = shuffleArray(bookmarkSets);
  const shuffledBookmarks = _.sortBy(bookmarks.slice(), (item) =>
    bookmarkSets.indexOf(item.set),
  );
  return shuffledBookmarks;
};

const findNextSetIndex = (activeIndex, allContents) => {
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

export {shuffleArray, findNextSetIndex, shuffleBookmarks};
