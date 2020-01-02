import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { Course } from '../model/course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  loadAllCourses(): Observable<Course[]> {
    return this.db
    .collection('courses')
    .snapshotChanges()
    .pipe(
      map(snaps =>
        snaps.map(
          snap =>
            <Course>{
              id: snap.payload.doc.id,
              ...(snap.payload.doc.data() as Course)
            }
        )
      ),
      first()
    );
  }
}
