import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { TextAst } from '@angular/compiler';
import { Observable } from 'rxjs';
import { last, concatMap } from 'rxjs/operators';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
})
export class CourseDialogComponent {
  form: FormGroup;
  description: string;

  private course: Course;
  uploadPercent$: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private storage: AngularFireStorage,
  ) {
    const titles = course.titles;

    this.course = course;

    this.form = fb.group({
      description: [titles.description, Validators.required],
      longDescription: [titles.longDescription, Validators.required],
    });
  }

  uploadFile(event: InputEvent): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    const filePath = `courses/${this.course.id}/${file.name}`;
    const task = this.storage.upload(filePath, file);

    this.uploadPercent$ = task.percentageChanges();
  }

  save(): void {
    const changes = this.form.value;

    this.coursesService
      .saveCourse(this.course.id, { titles: changes })
      .subscribe(() => {
        this.dialogRef.close(this.form.value);
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
