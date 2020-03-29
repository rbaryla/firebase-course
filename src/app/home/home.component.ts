import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private corses$: Observable<Course[]>;
  beginersCorses$: Observable<Course[]>;
  advancedCorses$: Observable<Course[]>;

  constructor(private couresService: CoursesService) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.corses$ = this.couresService.loadAllCourses();

    this.beginersCorses$ = this.corses$.pipe(
      map(courses =>
        courses.filter(course => course.categories.includes('BEGINNER')),
      ),
    );

    this.advancedCorses$ = this.corses$.pipe(
      map(courses =>
        courses.filter(course => course.categories.includes('ADVANCED')),
      ),
    );
  }
}
