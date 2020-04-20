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

const findNextSetIndex = (activeIndex, allContents) => {
  let nextIndex = null;
  for (let i = activeIndex + 1; i < allContents.length; i++) {
    const elem = allContents[activeIndex];
    if (elem && elem.setId !== allContents[i].setId) {
      nextIndex = i;
      break;
    }
  }
  return nextIndex;
};

export {shuffleArray, findNextSetIndex};
