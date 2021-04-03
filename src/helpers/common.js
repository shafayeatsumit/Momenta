export const getTodaysDate = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  return date;
};


export const findNextTrack = (tracks, lastTrack) => {
  const currentTrackIndex = tracks.findIndex((item) => item.id === lastTrack)
  const isLastTrack = currentTrackIndex + 1 === tracks.length
  if (currentTrackIndex === -1 || isLastTrack) {
    return 0;
  }
  return currentTrackIndex + 1;
}

