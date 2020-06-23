import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

const ICON_SIZE = RFValue(35);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252a43',
  },
  container: {
    flex: 1,
    zIndex: 0,
    backgroundColor: '#252a43',
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  topRow: {
    height: ScreenHeight * 0.2,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slideContainer: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  categoryContainer: {
    height: ScreenHeight * 0.05,
  },
  thoughtContainer: {
    marginTop: 50,
    height: ScreenHeight * 0.4,
    paddingHorizontal: 15,
  },
  footerContainer: {
    height: ScreenHeight * 0.15,
    width: ScreenWidth * 0.25,
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconDownContainer: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
    height: 35,
    width: 35,
  },
  iconDown: {
    height: 35,
    width: 35,
    tintColor: 'rgba(255,255,255,0.8)',
  },
  categoryHolder: {
    position: 'absolute',
    top: ScreenHeight * 0.15,
    left: 0,
    width: ScreenWidth,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
  },
  nextIconContainer: {
    top:30,
    right:20,    
    position:'absolute',
    height:60,
    width:60,
    zIndex:3,    
    alignItems:'center',
  },
  nextIcon: {
    height:28,
    width:28,
    tintColor:'white',
  },
  content: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    paddingRight: 20,
    zIndex: 1,
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'rgba(255,255,255,0.2)',
  },
  iconMore: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginRight: 20,
    tintColor: 'rgba(255,255,255,0.2)',
  },
  bookmarkIconContainer: {
    height: 55,
    width: 55,
    position: 'absolute',
    bottom: 30,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    height: 35,
    width: 35,
    marginTop: 5,
    tintColor: 'rgba(255,255,255,0.8)',
  },
  bookmarkColor: {
    tintColor: 'rgb(60,113,222)',
  },
  progressText: {
    fontSize: RFValue(12),
    color: 'white',
    fontFamily: FontType.Regular,
  },
  nextButton: {
    position: 'absolute',
    height: 35,
    width: 120,
    borderRadius: 50,
    bottom: 25,
    right: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
