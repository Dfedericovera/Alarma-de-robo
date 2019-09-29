import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  classApplied = false;

  constructor() { }

  ngOnInit() {
  }

  flip() {
    // Checking for CSS 3D transformation support
    var css3d = this.supportsCSS3D();

    var formContainer = document.getElementById('#formContainer');

    // Listening for clicks on the ribbon links
    this.classApplied = !this.classApplied;
    console.log(this.classApplied);
    // If there is no CSS3 3D support, simply
    // hide the login form (exposing the recover one)
  }
  // A helper function that checks for the 
  // support of the 3D CSS3 transformations.
  supportsCSS3D() {
    var props = [
      'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
    ], testDom = document.createElement('a');

    for (var i = 0; i < props.length; i++) {
      if (props[i] in testDom.style) {
        return true;
      }
    }

    return false;
  }
}
