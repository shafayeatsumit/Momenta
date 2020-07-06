import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType} from '../../helpers/theme';
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1f37',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  breathingGameContainer: {
    height: ScreenHeight,
    width: ScreenWidth,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    zIndex: 0,
    backgroundColor: '#1b1f37',
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontFamily: FontType.Bold,
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    padding: 15,
    zIndex: 1,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  category: {
    fontFamily: FontType.ExtraBold,
    color: 'white',
    fontSize: 40,
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
    textAlign: 'center',
  },

  categoryHolder: {
    position: 'absolute',
    top: ScreenHeight * 0.15,
    left: 0,
    width: ScreenWidth,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextIconContainer: {
    top: 30,
    right: 20,
    position: 'absolute',
    height: 60,
    width: 60,
    zIndex: 3,
    alignItems: 'center',
  },
  nextIcon: {
    height: 28,
    width: 28,
    tintColor: 'white',
  },

  starIconContainer: {
    height: 55,
    width: 55,
    position: 'absolute',
    bottom: 30,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    height: 35,
    width: 35,
    marginTop: 5,
    tintColor: 'rgba(255,255,255,0.8)',
  },
  starColor: {
    tintColor: 'rgb(60,113,222)',
  },
  nextButton: {
    position: 'absolute',
    height: 40,
    width: 120,
    borderRadius: 50,
    bottom: 25,
    right: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: {height: 1, width: 1},
    textShadowRadius: 2,
  },
  touchHandler: {
    position: 'absolute',
    bottom: 0,
    width: ScreenWidth,
    height: ScreenHeight * 0.2,    
  },
});

export default styles;
