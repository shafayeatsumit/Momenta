const RNFS = require('react-native-fs');

const background = false;
const begin = null;
const progressDivider = 10;
const getUrlExtension = (url: string): string => {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

const progress = (data: { bytesWritten: number; contentLength: number; }): void => {
  const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
  const text = `Progress ${percentage}%`;

};


export const downloadFile = (name: string, url: string) => {
  const fileExt = getUrlExtension(url);
  const fileName = new Date().toISOString() + "_" + name;
  const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}-.${fileExt}`;
  RNFS.downloadFile({ fromUrl: url, toFile: downloadDest, begin, progress, background, progressDivider })
  return downloadDest
}