import * as functions from 'firebase-functions';
import express = require('express');
import { db } from './init';
import { Course } from './model/course';
import cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.get('/courses', async (request, response) => {
  const snaps = await db.collection('courses').get();
  const courses: Course[] = [];

  snaps.forEach(snap => courses.push(snap.data() as Course));

  response.status(200).json({ courses });
});

export const getCourses = functions.https.onRequest(app);

export { onAddLesson, onDeleteLesson } from './lessons-counter';
