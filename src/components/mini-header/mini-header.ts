import { Component } from '@angular/core';

/**
 * Generated class for the MiniHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mini-header',
  templateUrl: 'mini-header.html'
})
export class MiniHeaderComponent {

  text: string;

  constructor() {
    console.log('Hello MiniHeaderComponent Component');
    this.text = 'Hello World';
  }

}
