import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleSelectedTag, fetchTags} from '../../redux/actions/tag';
import Content from '../content/Content';
import Tag from './Tag';
import RBSheet from '../../components/rbsheet';
import MinimizedView from '../../components/minimizedView/MinimizedView';
import styles from './Home.styles';
import {api} from '../../helpers/api';
import {rbSheetStyle, rbSheetProps} from '../../helpers/constants/rbsheet';
import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';

const Home = () => {
  const [backgroundImages, setImage] = useState([]);
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const minimized = useSelector((state) => state.minimized);
  const contentType = useSelector((state) => state.contentType);
  const categories = useSelector((state) => state.categories);
  const loginInfo = useSelector((state) => state.loginInfo);
  const handleTagPress = (id) => {
    dispatch(toggleSelectedTag(id));
  };

  const rbsheetClose = () => {
    console.log('rb sheet close');
    dispatch({type: 'SET_MINIMIZE_TRUE'});
    refRBSheet.current.close();
  };
  const handleClose = () => {
    analytics().logEvent('minimize');
    dispatch({type: 'SET_MINIMIZE_TRUE'});
  };

  const fetchBackgroundImage = () => {
    api
      .get('api/background_images')
      .then((resp) => {
        setImage(resp.data);
      })
      .catch((error) => console.log('error', error));
  };

  const handleOpen = () => {
    analytics().logEvent('maximize');
  };
  const handleStart = () => {
    dispatch({type: 'SET_CONTENT_TYPE', contentType: 'regular'});
    refRBSheet.current.open();
  };

  useEffect(() => {
    // we need to rip it off after alpha
    dispatch(fetchTags());
    fetchBackgroundImage();
    if (loginInfo.userId) {
      const userId = loginInfo.userId;
      analytics().setUserId(userId.toString());
    }
    if (!loginInfo.token) {
      api
        .post('api/auth/anonymoussignup/')
        .then((resp) => {
          const {id} = resp.data;
          dispatch({type: 'UPDATE_TOKEN', data: resp.data});
          analytics().setUserId(id.toString());
        })
        .catch((error) => console.log('error', error));
    }
  }, []);

  const rbSheetOpen = () => {
    if (contentType === 'regular' && categories.selected.length === 0) {
      return;
    }
    refRBSheet.current.open();
  };
  const itemSelected = categories.selected.length;
  const showStartButton = !minimized && itemSelected > 0;
  const backgroundImage = _.sample(backgroundImages);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <View />
        </View>
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
        <RBSheet
          ref={refRBSheet}
          onClose={handleClose}
          onOpen={handleOpen}
          {...rbSheetProps}
          customStyles={rbSheetStyle}>
          <Content
            closeSheet={rbsheetClose}
            backgroundImage={backgroundImage}
          />
        </RBSheet>
        {minimized && <MinimizedView maximize={rbSheetOpen} />}
        {showStartButton && (
          <View style={styles.startButtonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.start}>Start Mix</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default Home;
