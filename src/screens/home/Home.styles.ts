import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from '../../helpers/constants/common';
import { Colors, FontType } from '../../helpers/theme';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  tilesContainer: {
    paddingTop: 40,
    paddingBottom: 10,
    flexGrow: 1,
    marginHorizontal: 20,
  },
  titleHolder: {
    // height: 20,
    width: 180,
    marginTop: 50,
    marginLeft: 40,
    // backgroundColor: 'red',
  },
  title: {
    fontFamily: FontType.Bold,
    fontSize: 28,
    color: 'white',
  }
});

export default styles;
