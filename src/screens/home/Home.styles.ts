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
    flexGrow: 1,
    paddingRight: 10,
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
