export const BREATHING_TYPES = [
  {
    id: 'calm',
    name: 'Calm',
    type: 'guided',
    dynamicTarget: true,
    targetInhale: 5 * 1000,
    targetExhale: 5 * 1000,
    calibrationExhale: 3 * 1000,
    calibrationInhale: 3 * 1000,
    firstThreshold: 60 * 1000,
    breathingTime: 5,
    image: require('../../assets/images/calm.jpg'),

    name_line_one: null,
    name_line_two: 'Calm',
    description:
      'Adaptive exercise that rebalances your breathing patterns to bring you into natural calmness and clarity.',
  },
  {
    id: 'prepare_for_sleep',
    name: 'Prepare For Sleep',
    type: 'guided',
    dynamicTarget: true,
    targetInhale: 4 * 1000,
    targetExhale: 8 * 1000,
    calibrationExhale: 3 * 1000,
    calibrationInhale: 3 * 1000,
    firstThreshold: 240 * 1000,
    breathingTime: 5,
    image: require('../../assets/images/prepare_for_sleep.jpg'),
    name_line_one: 'Prepare for',
    name_line_two: 'Sleep',
    description:
      'Adaptive exercise that shifts breathing to longer, slower exhaling, which mimics how we breathe as we sleep.',
  },
  {
    id: 'four_seven_eight',
    name: '4/7/8/0',
    type: 'fixed',
    inhale: 4,
    inhaleHold: 7,
    exhale: 8,
    exhaleHold: 0,
    breathingTime: 5,
    image: require('../../assets/images/four_seven_eight.jpg'),
    name_line_one: 'Four seven',
    name_line_two: 'Eight',
    description:
      'Fixed interval breathing exercise known as the "Relaxing Breath". Note this can be tougher for beginners',
  },

  {
    id: 'box',
    name: 'Box',
    type: 'fixed',
    inhale: 4,
    inhaleHold: 4,
    exhale: 4,
    exhaleHold: 4,
    breathingTime: 5,
    image: require('../../assets/images/box_breath.jpg'),
    name_line_one: 'Box',
    name_line_two: 'Breath',
    description:
      'Fixed interval breathing popularized by the Navy SEALS. Produces focus and calm',
  },
];

export const MindfulChallenge = {
  id: 'mindful_challenge',
  name: 'Mindful Challenge',
  type: 'guided',
  dynamicTarget: true,
  targetInhale: 5 * 1000,
  targetExhale: 5 * 1000,
  calibrationExhale: 3 * 1000,
  calibrationInhale: 3 * 1000,
  firstThreshold: 60 * 1000,
  breathingTime: 2,
  image: require('../../assets/images/calm.jpg'),
  challenge: true,
  name_line_one: 'Mindful',
  name_line_two: 'Challenge',
  description:
    'Adaptive exercise that rebalances your breathing patterns to bring you into natural calmness and clarity.',
};

export const CalmBreathingChallenge = {
  id: 'calm_breathing_challenge',
  name: 'Calm Breathing Challenge',
  type: 'guided',
  dynamicTarget: true,
  targetInhale: 5 * 1000,
  targetExhale: 5 * 1000,
  calibrationExhale: 3 * 1000,
  calibrationInhale: 3 * 1000,
  firstThreshold: 60 * 1000,
  breathingTime: 2,
  image: require('../../assets/images/calm.jpg'),
  challenge: true,
  name_line_one: 'Calm Breathing',
  name_line_two: 'Challenge',
  description:
    'Adaptive exercise that rebalances your breathing patterns to bring you into natural calmness and clarity.',
};

export const ExerciseDescription = {
  calm: {
    summary:
      'Rebalances your exhale and inhale into better alignment for calm, clarity, and focus.',
    target_breathing_rhythms: '5 s Exhale\n5 s Inhale\n6 Breaths/min',
    directions:
      'Exhale and inhale slowly through your nose.\n\nWe don’t want big breaths.We want calm, easy, and consistent breathing with exhales that are as long as inhales.When we inhale more than we exhale, we typically lose our calm.',
  },
  prepare_for_sleep: {
    summary:
      'Gently and naturally extends your exhale length while keeping your inhale length constant which helps you get sleepy.',
    target_breathing_rhythms: '8 s Exhale\n4 s Inhale\n5 Breaths/min',
    directions:
      'Exhale and inhale slowly through your nose.\n\nFocus on your making your exhales longer, smoother and easier over the exercise without taking any big inhales. We want smaller inhales while taking longer exhales',
  },
  box: {
    summary:
      'Popularized by the Navy SEALS, this fixed interval breathing exercise brings immediate focus and calm. Note this might be harder for anyone new to breathing exercises.',
    target_breathing_rhythms:
      '4 s Exhale\n4 s Hold\n4 s Inhale\n4 s Hold\n3.75 Breaths/min',
    directions:
      'Exhale through your mouth. Inhale through your nose.\n\nNote that the size of your exhales and inhales should be normal or even smaller than normal. Taking big breaths is counter productive. This exercise works because it forces you to take much longer breaths you would normally take, which requires you to be very mindful of your breathing. Big breaths are not required here. If you find yourself taking big breaths, you should try the “Calm” exercise, which was designed to achieve the same results while being less intense.',
  },
  four_seven_eight: {
    summary:
      'Popularized by Dr. Andrew Weil, this fixed interval breathing exercise is called the “Relaxation Breath” and works for relaxing and sleeping. Note this might be very hard for anyone new to breathing exercises.',
    target_breathing_rhythms: '8 s Exhale\n7 s Hold\n4 s Inhale\n3 Breaths/min',
    directions:
      'Exhale and inhale through your nose\n\nThe focus of this exercise is lengthening your breathing time overall without taking big “deep” inhales. (This might be tougher for beginners.) Ideally, you will take a normal sized inhale over 4 seconds, hold at the top of that inhale for 7 seconds, and then exhale very slowly and gently for 8 seconds. If you find yourself unable to take regular sized inhales, you should stop and try the “Prepare for Sleep” exercise, which was designed to be less intense.',
  },
  mindful_challenge: {
    summary:
      'Rebalances your exhale and inhale into better alignment for calm, clarity, and focus.',
    target_breathing_rhythms: '5 s Exhale\n5 s Inhale\n6 Breaths/min',
    directions:
      'Exhale and inhale slowly through your nose.\n\nWe don’t want big breaths.We want calm, easy, and consistent breathing with exhales that are as long as inhales.When we inhale more than we exhale, we typically lose our calm.',
  },
};
