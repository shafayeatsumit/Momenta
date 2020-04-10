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
import {colors, fontType, fonts} from '../../helpers/theme';
import Content from '../content/Content';
import Category from './Category';
import RBSheet from '../../components/rbsheet';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';

const Explore = () => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const categories = useSelector((state) => state.categories);
  const handleCategoryPress = (id) => dispatch(toggleCategory(id));
  const showStart = categories.some((item) => item.selected);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.tilesContainer}>
          {categories.map((item) => (
            <Category
              item={item}
              key={item.id}
              handlePress={() => refRBSheet.current.open()}
              handleLongPress={() => handleCategoryPress(item.id)}
            />
          ))}
        </ScrollView>
        {showStart && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => refRBSheet.current.open()}>
            <Text style={styles.start}>Start</Text>
          </TouchableOpacity>
        )}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={ScreenHeight - 40}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: 'transparent',
            },
          }}>
          <Content />
        </RBSheet>
      </SafeAreaView>
    </>
  );
};
export default Explore;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  tilesContainer: {
    marginTop: 20,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  startButton: {
    position: 'absolute',
    alignSelf: 'center',
    height: 50,
    width: ScreenWidth * 0.7,
    borderRadius: 5,
    backgroundColor: '#3D71DE',
    bottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    fontFamily: FontType.SemiBold,
    fontSize: 20,
    color: 'white',
  },
});
