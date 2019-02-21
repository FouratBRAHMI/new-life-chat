import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the MapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsProvider {

  constructor(private afStore: AngularFirestore) {
  }

  getPlacesBySector(secteur) {
    return this.afStore.collection('carte').doc(secteur).valueChanges();
  }

  addMarkertosector(pos, secteur) {
    return this.afStore.collection('carte').doc(secteur).valueChanges().first()
      .flatMap(col => {
        if (col)
          col['places'].push(pos);
        else
          col = { places: [] }
        return this.afStore.collection('carte').doc(secteur).set(col);
      });
  }

  deleteMarker(secteur, index) {
    return this.afStore.collection('carte').doc(secteur).valueChanges().first()
      .flatMap(col => {
        col['places'].splice(index, 1);
        return this.afStore.collection('carte').doc(secteur).set(col);
      });
  }

}
