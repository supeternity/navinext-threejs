
//                                       NAVINEXT-RENDER
// _____________________________________________________

//
// Special helper for Treejs ES6 build
// Timilink Company, 2018
//
// mail for support supraeternity@timilink.ru
//                  supraeternity@protonmail.com

//
// Logical:
// From d3-threeD.js

//
// specification 
//    http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
// example:
//    https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_shapes2.html
/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

// -----------------------------------------------------
// usage example
// const my3d = new svgExtruder( your_flat_shape );     
//       my3d.mesh; // true THREE.Mesh                  
// -----------------------------------------------------

// Global imports -
import * as THREE from 'three';

// Local imports -
import Material from './material';


export default class Extruder {

  constructor ( draw, props ) {
    this.draw = draw;
    this.props = props;
    this.extrude();
  }


  //                                          local methods
  // ______________________________________________________
  
  extrude() {
    this.geometry = new THREE.ExtrudeGeometry( this.draw, {
      amount: this.props.depth,
      steps: 1,
      bevelEnabled: false,
      bevelThickness: 40,
      bevelSize: -10,
      bevelSegments: 40,
      curveSegments: 30,
    });
    console.log(-10, this.props);
    this.material = new Material( this.props.room.color ).standard;
    const obj = new THREE.Mesh( this.geometry, this.material );
    obj.rotateX( 90 * Math.PI / 180 );
    this.obj = obj;
  }


  //                                              class API
  // ______________________________________________________

  // method() {

  // }

}
