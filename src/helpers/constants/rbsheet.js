import {ScreenHeight} from './common';

export const rbSheetStyle = {
  wrapper: {
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    backgroundColor: 'transparent',
  },
};
export const rbSheetProps = {
  closeOnDragDown: true,
  animationType: 'fade',
  closeOnPressMask: false,
  duration: 500,
  height: ScreenHeight,
};
