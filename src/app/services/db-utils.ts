import { DocumentChangeAction } from '@angular/fire/firestore';

export function convertSnaps<T>(snaps: DocumentChangeAction<unknown>[]) {
  return snaps.map(
    snap =>
      <T>{
        id: snap.payload.doc.id,
        ...(snap.payload.doc.data() as T),
      },
  );
}
