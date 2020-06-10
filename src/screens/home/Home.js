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
import {rbSheetStyle, rbSheetProps} from '../../helpers/constants/rbsheet';
import analytics from '@react-native-firebase/analytics';

const Home = () => {
  const [minimizeBreathingGame, setMinimizeBreathingGame] = useState(false);
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const minimized = useSelector((state) => state.minimized);
  const loginInfo = useSelector((state) => state.loginInfo);
  const tagNames = useSelector((state) => state.tagNames);
  const selectedTags = useSelector((state) => state.selectedTags);
  const backgrounds = useSelector((state) => state.backgrounds);
  const hasTag = tagNames.length;

  const rbsheetClose = () => {
    dispatch({type: 'SET_MINIMIZE_TRUE'});
    refRBSheet.current.close();
    minimizeBreathingGame && setMinimizeBreathingGame(false);
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

  const handleTagPress = (id) => dispatch(toggleSelectedTag(id));
  const handleOpen = () => analytics().logEvent('maximize');
  const rbSheetOpen = () => refRBSheet.current.open();

  useEffect(() => {
    !hasTag && dispatch(fetchTags());
    !loginInfo.token && dispatch(anonymousSignup());
    loginInfo.userId && analytics().setUserId(loginInfo.userId.toString());
  }, []);

  const tagSelected = selectedTags.length;
  const showStartButton = !minimized && tagSelected > 0;
  const showTags = hasTag && backgrounds.length;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <View />
        </View>
        {showTags ? (
          <ScrollView contentContainerStyle={styles.tilesContainer}>
            {tagNames.map((item) => (
              <Tag
                item={item}
                key={item.id}
                handlePress={() => handleTagPress(item.id)}
                selectedTags={selectedTags}
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
            showBreathingGame={minimizeBreathingGame}
          />
        </RBSheet>
        {minimized && <MinimizedView maximize={rbSheetOpen} />}
        {showStartButton && (
          <View style={styles.startButtonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={rbSheetOpen}>
              <Text style={styles.start}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default Home;
