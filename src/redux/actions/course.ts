import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const COURSE_URL = "courses";

export interface courseLesson {
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
  lesons: Array<courseLesson>;
  totalLessons: number;
  totalDuration: number;
  about: string;
}

export type Courses = {
  [name: string]: Course;
}

export interface FetchCourseAction {
  type: ActionTypes.AddCourse;
  payload: any;
}

export const fetchCourse = () => {
  console.log('going to fetch courses here');
  return async (dispatch: Dispatch) => {
    const response = await api.get(COURSE_URL);
    let courses: Course[] = response.data;
    const coursePayload: any = _.mapKeys(courses, "name");
    dispatch<FetchCourseAction>({
      type: ActionTypes.AddCourse,
      payload: coursePayload,
    })
  }
}