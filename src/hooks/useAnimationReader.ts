import { useState, useEffect } from 'react';
var RNFS = require('react-native-fs');

export default function useAnimationReader(filePath: string) {
  const [animationFile, setAnimationFile] = useState<any>()
  useEffect(() => {
    RNFS.readFile(filePath, 'utf8')
      .then((res: any) => {
        setAnimationFile(JSON.parse(res))
      })
      .catch((error: any) => console.log('error', error))
  }, [])
  return {
    animationFile,
  }
}