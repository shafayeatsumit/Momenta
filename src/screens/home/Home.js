import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  toggleSelectedTag,
  fetchTags,
  anonymousSignup,
} from '../../redux/actions/tag';
import Content from '../content/Content';
import Tag from './Tag';
import RBSheet from '../../components/rbsheet';
import MinimizedView from '../../components/minimizedView/MinimizedView';
import styles from './Home.styles';
import {api, imageDownloader} from '../../helpers/api';
import {rbSheetStyle, rbSheetProps} from '../../helpers/constants/rbsheet';
import analytics from '@react-native-firebase/analytics';

const Home = () => {
  const [backgroundImage, setImage] = useState([]);
  const [minimizeBreathingGame, setMinimizeBreathingGame] = useState(false);
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const minimized = useSelector((state) => state.minimized);
  const categories = useSelector((state) => state.categories);
  const loginInfo = useSelector((state) => state.loginInfo);
  const handleTagPress = (id) => {
    dispatch(toggleSelectedTag(id));
  };

  const rbsheetClose = () => {
    dispatch({type: 'SET_MINIMIZE_TRUE'});
    refRBSheet.current.close();
    minimizeBreathingGame && setMinimizeBreathingGame(false);
  };

  const downLoadImage = (imageObject) => {
    imageDownloader(imageObject.image)
      .then((resp) => {
        const base64uri = {uri: `data:image/jpeg;base64,${resp}`};
        setImage(base64uri);
      })
      .catch((error) => console.log('error here', error));
  };
  const rbsheetCloseBreathingGame = () => {
    dispatch({type: 'SET_MINIMIZE_TRUE'});
    setMinimizeBreathingGame(true);
    refRBSheet.current.close();
  };

  const handleClose = () => {
    analytics().logEvent('minimize');
    dispatch({type: 'SET_MINIMIZE_TRUE'});
  };

  const fetchBackgroundImage = () => {
    api
      .get('api/background_images')
      .then((resp) => downLoadImage(resp.data))
      .catch((error) => console.log('error', error));
  };

  const handleOpen = () => {
    analytics().logEvent('maximize');
  };
  const handleStart = () => {
    refRBSheet.current.open();
  };

  useEffect(() => {
    dispatch(fetchTags());
    fetchBackgroundImage();
    if (loginInfo.userId) {
      const userId = loginInfo.userId;
      analytics().setUserId(userId.toString());
    }
    if (!loginInfo.token) {
      dispatch(anonymousSignup());
    }
  }, []);

  const rbSheetOpen = () => {
    refRBSheet.current.open();
  };
  const itemSelected = categories.selected.length;
  const showStartButton = !minimized && itemSelected > 0;
  const hasTag = categories.items.length;
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <View />
        </View>
        {hasTag ? (
          <ScrollView contentContainerStyle={styles.tilesContainer}>
            {categories.items.map((item) => (
              <Tag
                item={item}
                key={item.id}
                handlePress={() => handleTagPress(item.id)}
                multiselectMode={categories.multiselectMode}
                selectedItems={categories.selected}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="rgb(120,121,137)" />
          </View>
        )}
        <RBSheet
          ref={refRBSheet}
          onClose={handleClose}
          onOpen={handleOpen}
          {...rbSheetProps}
          customStyles={rbSheetStyle}>
          <Content
            closeSheet={rbsheetClose}
            closeBreathingGame={rbsheetCloseBreathingGame}
            backgroundImage={backgroundImage}
            showBreathingGame={minimizeBreathingGame}
          />
        </RBSheet>
        {minimized && <MinimizedView maximize={rbSheetOpen} />}
        {showStartButton && (
          <View style={styles.startButtonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.start}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default Home;
