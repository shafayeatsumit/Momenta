import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const COURSE_URL = "courses";

export interface courseTrack {
  id: string;
  order: number;
  title: string;
  url: string;
}

export interface Course {
  id: string;
  name: string;
  backgroundGradient: Array<string>;
  thumbnail: string;
  thumbnailTitle: string;
  level: string;
  backgroundImage: string;
  tracks: Array<courseTrack>;
  totalLessons: number;
  totalDuration: number;
  inhaleTime: number;
  exhaleTime: number;
}

export type Courses = {
  [name: string]: Course;
}

export interface FetchCourseAction {
  type: ActionTypes.AddCourse;
  payload: any;
}

export const fetchCourse = () => {
  return async (dispatch: Dispatch) => {
    const response = await api.get(COURSE_URL);
    let courses: Course[] = response.data.courses;
    const coursePayload: any = _.mapKeys(courses, "name");
    dispatch<FetchCourseAction>({
      type: ActionTypes.AddExercise,
      payload: coursePayload,
    })
  }
}