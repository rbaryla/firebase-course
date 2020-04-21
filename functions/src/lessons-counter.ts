import * as functions from 'firebase-functions';
import { db } from './init';
import { Course } from './model/course';
import { firestore } from 'firebase-admin';

export const onAddLesson = functions.firestore
  .document('courses/{courseId}/lessons/{lessonId}')
  .onCreate(async (snap, context) => {
    const courseId = context.params.courseId;

    console.log(`Running onAddLesson fuction for course ${courseId}`);

    return courseTransaction(snap, (course: { lessonsCount: number }) => {
      return { lessonsCount: course ? course.lessonsCount + 1 : 1 };
    });
  });

export const onDeleteLesson = functions.firestore
  .document('courses/{courseId}/lessons/{lessonId}')
  .onDelete(async (snap, context) => {
    const courseId = context.params.courseId;

    console.log(`Running onDeleteLesson fuction for course ${courseId}`);

    return courseTransaction(snap, (course: { lessonsCount: number }) => {
      return { lessonsCount: course ? course.lessonsCount - 1 : 1 };
    });
  });

async function courseTransaction(
  snap: functions.firestore.DocumentSnapshot,
  cb: Function,
): Promise<void> {
  return db.runTransaction(async transation => {
    const courseRef = snap.ref.parent.parent as firestore.DocumentReference<
      Course
    >;
    const courseSnap = await transation.get(courseRef);
    const course = courseSnap.data();
    const changes = cb(course);
    transation.update(courseRef, changes);
  });
}
