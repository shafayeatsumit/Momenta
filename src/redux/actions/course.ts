import { Dispatch } from 'redux';
import { api } from '../../helpers/api';
import { ActionTypes } from './types';
import _ from "lodash";

const COURSE_URL = "courses";

export interface Lesson {
  id: string,
  title: string,
  duration: number,
  order: number,
  url: string,
  listingTitle: string,
}

export interface Course {
  id: string,
  primaryColor: string,
  backgroundImage: string,
  thumbnail: string,
  thumbnailTitle: string,
  name: string,
  info: string,
  summary: string,
  lessons: Lesson[];
  defaultMusic: string,
  numberOfDays: number,
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
    let courses: Course[] = response.data;
    const coursePayload: any = _.mapKeys(courses, "name");
    dispatch<FetchCourseAction>({
      type: ActionTypes.AddCourse,
      payload: coursePayload,
    })
  }
}