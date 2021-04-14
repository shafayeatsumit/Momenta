import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from '../../helpers/constants/common';
import { Colors, FontType } from '../../helpers/theme';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  spacer: {
    height: 60,
  },
  tilesContainer: {
    paddingTop: 10,
    // paddingBottom: 10,
    flexGrow: 1,
    marginHorizontal: 20,
  },
  titleHolder: {
    width: 280,
    marginLeft: 40,
  },
  title: {
    fontFamily: FontType.Bold,
    fontSize: 20,
    color: 'white',
  }
});

export default styles;
