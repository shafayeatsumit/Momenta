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
import {toggleCategory} from '../../redux/actions/category';
import Content from '../content/Content';
import Category from './Category';
import RBSheet from '../../components/rbsheet';
import MinimizedView from '../../components/minimizedView/MinimizedView';
import {ScreenHeight} from '../../helpers/constants/common';
import styles from './Home.styles';
import {api} from '../../helpers/api';

const Home = () => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const minimized = useSelector((state) => state.minimized);
  const categories = useSelector((state) => state.categories);

  const handleCategoryPress = (id) => {
    if (categories.multiselectMode) {
      dispatch(toggleCategory(id));
    } else {
      dispatch(toggleCategory(id));
      dispatch({type: 'SET_CONTENT_TYPE', contentType: 'regular'});
      refRBSheet.current.open();
    }
  };
  const longPressCategory = () => dispatch({type: 'MULTI_SELECT_MODE'});
  const rbsheetClose = () => {
    dispatch({type: 'SET_MINIMIZE_TRUE'});
    refRBSheet.current.close();
  };
  const handleClose = () => dispatch({type: 'SET_MINIMIZE_TRUE'});
  const cancelMultiselect = () => dispatch({type: 'RESET_CATEGORIES'});
  const handleStart = () => {
    dispatch({type: 'SET_CONTENT_TYPE', contentType: 'regular'});
    refRBSheet.current.open();
  };

  useEffect(() => {
    api
      .post('api/auth/anonymoussignup/')
      .then((resp) => console.log('resp', resp.data))
      .catch((error) => console.log('error', error));
  }, []);

  const rbSheetOpen = () => refRBSheet.current.open();
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
            <Category
              item={item}
              key={item.id}
              handlePress={() => handleCategoryPress(item.id)}
              multiselectMode={categories.multiselectMode}
              handleLongPress={longPressCategory}
              selectedItems={categories.selected}
            />
          ))}
        </ScrollView>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          onClose={handleClose}
          animationType={'fade'}
          closeOnPressMask={false}
          height={ScreenHeight}
          duration={400}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
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
