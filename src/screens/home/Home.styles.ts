import { StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from '../../helpers/constants/common';
import { Colors, FontType } from '../../helpers/theme';
const styles = StyleSheet.create({
  tilesContainer: {
    paddingTop: 40,
    paddingBottom: 10,
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: ScreenWidth * 0.05,
  },
});

export default styles;
