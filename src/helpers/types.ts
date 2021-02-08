export enum BreathingState {
  NotStarted,
  Inhale,
  InhaleHold,
  Exhale,
  ExhaleHold,
}

export enum ExerciseState {
  NotStarted,
  Paused,
  Play,
  Finish,
}

enum AnimationType {
  ExpandCircle,
  ShrinkCircle,
}

export interface ProgressType {
  animationType: AnimationType | null;
  duration: number;
}

export interface Lesson {
  id: string;
  url: string;
  order: number;
  title: string;
}
