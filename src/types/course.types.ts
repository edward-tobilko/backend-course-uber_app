export type CourseName = "front-end" | "back-end" | "devops" | "full-stack";

export interface Course {
  courseId: number;
  name: CourseName;
}

export interface DataBase {
  courses: Course[];
}
