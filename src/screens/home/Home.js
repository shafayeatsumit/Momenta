import React, {useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleSelectedTag} from '../../redux/actions/tag';
import Content from '../content/Content';
import Tag from './Tag';
import RBSheet from '../../components/rbsheet';
import MinimizedView from '../../components/minimizedView/MinimizedView';
import styles from './Home.styles';
import {api} from '../../helpers/api';
import {rbSheetStyle, rbSheetProps} from '../../helpers/constants/rbsheet';
import analytics from '@react-native-firebase/analytics';

const Home = () => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const minimized = useSelector((state) => state.minimized);
  const contentType = useSelector((state) => state.contentType);
  const categories = useSelector((state) => state.categories);
  const loginInfo = useSelector((state) => state.loginInfo);

  const handleTagPress = (id) => {
    dispatch(toggleSelectedTag(id));
    if (!categories.multiselectMode) {
      refRBSheet.current.open();
    }
  };
  const longPressTag = () => dispatch({type: 'MULTI_SELECT_MODE'});
  const rbsheetClose = () => {
    dispatch({type: 'SET_MINIMIZE_TRUE'});
    refRBSheet.current.close();
  };
  const handleClose = () => {
    analytics().logEvent('minimize');
    dispatch({type: 'SET_MINIMIZE_TRUE'});
  };
  const handleOpen = () => analytics().logEvent('maximize');
  const cancelMultiselect = () => dispatch({type: 'RESET_CATEGORIES'});
  const handleStart = () => {
    dispatch({type: 'SET_CONTENT_TYPE', contentType: 'regular'});
    refRBSheet.current.open();
  };

  useEffect(() => {
    if (!loginInfo.token) {
      api
        .post('api/auth/anonymoussignup/')
        .then((resp) => {
          const {token, anonymous} = resp.data;
          dispatch({type: 'UPDATE_TOKEN', token});
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
  const showStartButton =
    categories.multiselectMode && !minimized && itemSelected > 1;
  const showCancelButton = categories.multiselectMode && !minimized;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <View />
          {showCancelButton && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelMultiselect}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.tilesContainer}>
          {categories.items.map((item) => (
            <Tag
              item={item}
              key={item.id}
              handlePress={() => handleTagPress(item.id)}
              multiselectMode={categories.multiselectMode}
              handleLongPress={longPressTag}
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
          <Content closeSheet={rbsheetClose} />
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
