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

const getFileName = (name: string): string => {
  // replace whtiespace with underscore
  name = name.replace(/\s+/g, '_');
  // had to replace : otherwise file can not be read by RNFS
  const date = new Date().toJSON().replace(/:/g, "_");
  return date + "_" + name;
}

export const getDownloadPath = (name: string, url: string) => {
  const fileExt = getUrlExtension(url);
  const fileName = getFileName(name);
  const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}.${fileExt}`;
  return downloadPath;
}


export const downloadFile = (url: string, downloadPath: string) => {
  const ret = RNFS.downloadFile({ fromUrl: url, toFile: downloadPath, begin, progress, background, progressDivider })
  return ret.promise
}