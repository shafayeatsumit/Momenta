import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {toggleCategory} from '../../redux/actions/category';
import Content from '../content/Content';
import {getCategory, getProgress} from '../../helpers/common';
import Category from './Category';
import RBSheet from '../../components/rbsheet';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import styles from './Home.styles';
import closeIcon from '../../../assets/icons/close.png';
const Home = () => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const categories = useSelector((state) => state.categories);
  const contents = useSelector((state) => state.contents);
  const handleCategoryPress = (id) => {
    if (categories.multiselectMode) {
      dispatch(toggleCategory(id));
    } else {
      dispatch(toggleCategory(id));
      refRBSheet.current.open();
    }
  };
  const longPressCategory = () => dispatch({type: 'MULTI_SELECT_MODE'});
  const rbsheetClose = () => {
    dispatch({type: 'MINIMIZE_CONTENT'});
    refRBSheet.current.close();
  };
  const handleClose = () => dispatch({type: 'MINIMIZE_CONTENT'});
  const minimizeScreenClose = () =>
    dispatch({type: 'RESET_CATEGORIES_CONTENT'});
  const cancelMultiselect = () => dispatch({type: 'RESET_CATEGORIES'});

  const rbSheetOpen = () => refRBSheet.current.open();

  const {minimized, activeIndex, allContents} = contents;
  const itemSelected = categories.selected.length;
  const showStartButton =
    categories.multiselectMode && !minimized && itemSelected > 1;
  const progress = getProgress(activeIndex, allContents);
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
        {minimized && (
          <View style={styles.miminizedView}>
            <TouchableOpacity
              style={styles.minimizedContentHolder}
              onPress={rbSheetOpen}>
              <Text style={styles.minimizeCategory}>
                {getCategory(activeIndex, allContents)}
              </Text>
              <Text style={styles.minimizeProgress}>
                {progress.currentIndex}/{progress.totalInTheSet}
              </Text>
            </TouchableOpacity>
            <View style={styles.minimizedIconHolder}>
              <TouchableOpacity onPress={minimizeScreenClose}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showStartButton && (
          <View style={styles.startButtonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={rbSheetOpen}>
              <Text style={styles.start}>Start Mix</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default Home;
