import SwellPlayer from "./SwellPlayer";


let swellPlayer: any = new SwellPlayer();
let exhaleSoundId: null | ReturnType<typeof setTimeout> = null;
let inhaleSoundId: null | ReturnType<typeof setTimeout> = null;


export const startSwellExhale = (exhaleDuration: number) => {
  const fadeOutDuration = 1250;
  exhaleSoundId = setTimeout(() => {
    swellPlayer.stopExhaleSound(fadeOutDuration);
    exhaleSoundId && clearTimeout(exhaleSoundId);
  }, exhaleDuration * 1000 - fadeOutDuration);
  swellPlayer.startExhaleSound();
};

export const startSwellInhale = (inhaleDuration: number) => {
  const fadeOutDuration = 1250;
  inhaleSoundId = setTimeout(() => {
    swellPlayer.stopInhaleSound(fadeOutDuration);
    inhaleSoundId && clearInterval(inhaleSoundId);
  }, inhaleDuration * 1000 - fadeOutDuration);
  swellPlayer.startInhaleSound();
};

export const stopSwellSound = () => {
  swellPlayer.stopSound();
  inhaleSoundId && clearInterval(inhaleSoundId);
  exhaleSoundId && clearTimeout(exhaleSoundId);
}