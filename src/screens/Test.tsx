import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import useInterval from "../helpers/hooks/useInterval";
import RNFetchBlob from 'rn-fetch-blob';
const url = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3";
const dirs = RNFetchBlob.fs.dirs
const Name = "sumit";

const Test = () => {
  useEffect(() => {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp3',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,

        path: RNFetchBlob.fs.dirs.DocumentDir + `${Name}`, // Android platform
        description: 'Downloading the file',
      },
    })
      .fetch('GET', url)
      .then(res => {
        console.log('res', res.data);
        console.log('The file is save to ', res.path());
      });
  }, [])
  return (
    <View style={styles.main}>

    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Test;