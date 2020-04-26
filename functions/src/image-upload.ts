import * as functions from 'firebase-functions';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';
import * as os from 'os';
import * as rimraf from 'rimraf';
import { db } from './init';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mkdirp = require('mkdir-promise');
const spawn = require('child-process-promise').spawn;

const gcs = new Storage();

export const resizeThumbnail = functions.storage
  .object()
  .onFinalize(async object => {
    const fileFullPath = object.name || '',
      contentType = object.contentType || '',
      fileDir = path.dirname(fileFullPath),
      fileName = path.basename(fileFullPath),
      tempLocalDir = path.join(os.tmpdir(), fileDir);

    console.log(
      'Thumbnail generation started: ',
      fileFullPath,
      fileDir,
      fileName,
    );

    if (!contentType.startsWith('image/') || fileName.startsWith('thumb_')) {
      console.log('Exiting image processing.');
      return null;
    }

    await mkdirp(tempLocalDir);

    const bucket = gcs.bucket(object.bucket);
    const originalImageFile = bucket.file(fileFullPath);
    const tempLocalFile = path.join(os.tmpdir(), fileFullPath);

    console.log(`Downloading image to: ${tempLocalFile}`);

    await originalImageFile.download({ destination: tempLocalFile });

    // Genereate a thumbnail using ImageMagic

    const outputFilePath = path.join(fileDir, `thumb_${fileName}`);
    const outputFile = path.join(os.tmpdir(), outputFilePath);

    console.log(`Generating a thumbnail to: ${outputFile}`);

    await spawn(
      'convert',
      [tempLocalFile, '-thumbnail', '510x287 >', outputFile],
      { capture: ['stdout', 'stderr'] },
    );

    // Upload Tumbnail to storage

    const metadata = {
      contentType: object.contentType,
      cacheControl: 'public,max-age=2592000, s-maxage=2592000',
    };

    console.log(
      'Uploading the thumbnail to storage:',
      outputFile,
      outputFilePath,
    );

    const uploadedFiles = await bucket.upload(outputFile, {
      destination: outputFilePath,
      metadata,
    });

    // delete local files to avoid filling up the system over time

    rimraf.sync(tempLocalDir);

    await originalImageFile.delete();

    // create link to uploaded file

    const thumbnail = uploadedFiles[0];
    const url = await thumbnail.getSignedUrl({
      action: 'read',
      expires: new Date(3000, 0, 1),
    });

    // save thumbnail link in database

    const frags = fileFullPath.split('/'),
      courseId = frags[1];

    console.log(`saving url to database: ${courseId}`);

    return db.doc(`courses/${courseId}`).update({ uploadedImageUrl: url });
  });
