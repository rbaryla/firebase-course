import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  course: Course;
  lessons: Lesson[];
  lastPageLoaded = 0;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data['course'];
    this.coursesService
      .findLessons(this.course.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(lessons => (this.lessons = lessons));
  }

  loadMore() {
    this.loading = true;
    this.lastPageLoaded++;

    this.coursesService
      .findLessons(this.course.id, 'asc', this.lastPageLoaded)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(lessons => (this.lessons = [...this.lessons, ...lessons]));
  }
}
