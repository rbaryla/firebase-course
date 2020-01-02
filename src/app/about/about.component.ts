import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CONFIG as config } from './../../../__private';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Course } from '../model/course';

firebase.initializeApp(config);

const db = firebase.firestore();

@Component({
  selector: "about",
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    db.collection('courses')
      .get()
      .then(snaps => {
        const courses: Course[] = snaps.docs.map(snap => {
          return <Course>{
            id: snap.id,
            ...snap.data()
          };
        });
        console.log(courses);
      });
  }
}
