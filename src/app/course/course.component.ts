import { OnDestroy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, OnDestroy {
  course: Course;
  lessons: Lesson[];

  private lessonsSubscriber$: Subscription;

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data['course'];
    this.lessonsSubscriber$ = this.coursesService
      .findLessons(this.course.id)
      .subscribe(lessons => (this.lessons = lessons));
  }

  ngOnDestroy() {
    if (this.lessonsSubscriber$) {
      this.lessonsSubscriber$.unsubscribe();
    }
  }

  loadMore() {}
}
