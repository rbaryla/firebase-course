import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { convertSnaps } from './db-utils';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private db: AngularFirestore) {}

  loadAllCourses(): Observable<Course[]> {
    return this.db
      .collection('courses', ref => ref.orderBy('seqNo'))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Course>(snaps)),
        first(),
      );
  }

  findCourseByUrl(courseUrl: string): Observable<Course> {
    return this.db
      .collection('courses', ref => ref.where('url', '==', courseUrl))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const courses = convertSnaps<Course>(snaps);
          console.log(courses);
          return courses.length === 1 ? courses[0] : undefined;
        }),
        first(),
      );
  }
}
