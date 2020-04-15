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
import {toggleCategory} from '../../redux/actions/toggleCategory';
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
  const handleCategoryPress = (id) => dispatch(toggleCategory(id));
  const showStart = categories.some((item) => item.selected);
  const rbsheetClose = () => {
    dispatch({type: 'MINIMIZE_CONTENT'});
    refRBSheet.current.close();
  };
  const handleClose = () => dispatch({type: 'MINIMIZE_CONTENT'});

  const minimizeScreenClose = () => dispatch({type: 'RESET_CONTENT'});

  const rbSheetOpen = () => {
    refRBSheet.current.open();
  };
  const {minimized, activeIndex, allContents} = contents;

  const progress = getProgress(activeIndex, allContents);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.tilesContainer}>
          {categories.map((item) => (
            <Category
              item={item}
              key={item.id}
              handlePress={rbSheetOpen}
              handleLongPress={() => handleCategoryPress(item.id)}
            />
          ))}
        </ScrollView>
        {showStart && (
          <TouchableOpacity style={styles.startButton} onPress={rbSheetOpen}>
            <Text style={styles.start}>Start</Text>
          </TouchableOpacity>
        )}
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
