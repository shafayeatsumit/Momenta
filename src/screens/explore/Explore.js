import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
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
import styles from './Explore.styles';
import closeIcon from '../../../assets/icons/close.png';
import {Image} from 'react-native';
const Explore = () => {
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
  // const showStart = categories.some((item) => item.selected);
  const rbsheetClose = () => {
    dispatch({type: 'MINIMIZE_CONTENT'});
    refRBSheet.current.close();
  };
  const handleClose = () => dispatch({type: 'MINIMIZE_CONTENT'});
  const minimizeScreenClose = () => dispatch({type: 'RESET_CONTENT'});
  const cancelMultiselect = () => dispatch({type: 'CACEL_MULTI_SELECT_MODE'});

  const rbSheetOpen = () => {
    refRBSheet.current.open();
  };
  const {minimized, activeIndex, allContents} = contents;

  const progress = getProgress(activeIndex, allContents);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.header}>
          <View />
          {categories.multiselectMode && (
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
            />
          ))}
        </ScrollView>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          onClose={handleClose}
          closeOnPressMask={false}
          height={ScreenHeight - 40}
          duration={350}
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
      </SafeAreaView>
    </>
  );
};
export default Explore;
