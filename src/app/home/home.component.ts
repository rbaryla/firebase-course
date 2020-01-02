import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: "home",
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private corses$: Observable<Course[]>;
  beginersCorses$: Observable<Course[]>;
  advancedCorses$: Observable<Course[]>;

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.corses$ = this.db
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
        )
      );

    this.beginersCorses$ = this.corses$.pipe(
      map(courses => courses.filter(
        course => course.categories.includes('BEGINNER')
      ))
    );

    this.advancedCorses$ = this.corses$.pipe(
      map(courses => courses.filter(
        course => course.categories.includes('ADVANCED')
      ))
    );
  }
}
