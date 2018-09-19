
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________


// Global imports -
import * as THREE from 'three';


//                                          Cell's fabric
// ______________________________________________________

export default class Cell {

  constructor( key, hyper, dimension, vec2 ) {
    this.key = key;
    this.hyper = hyper.clone();
    this.dimension = dimension;
    this.vec2 = vec2;
    this.position();
  }

  //                                          local methods
  // ______________________________________________________

  // ------------------------------------------------------
  //                                               position
  //
  // cell standing
  // ------------------------------------------------------
  //
  position() {
    const pd = 5; // one cell padding
    const pose = new THREE.Vector3();
    pose.setX( ( this.dimension.x *
      this.vec2.x ) + pd );
    pose.setZ( ( this.dimension.x *
      this.vec2.z ) + pd );
    pose.setY( this.dimension.z );
    this.hyper.position.setX(pose.x);
    this.hyper.position.setZ(pose.z);
    this.hyper.position.setY(pose.y);
  }


  //                                              class API
  // ______________________________________________________

  state( state ) {
    this.hyper.children.map(box => {
      if (`tictac-${state}` === box.name) {
        Object.defineProperty(box, 'visible', {
          value: true
        });
        box.children.map(mesh => {
          mesh.visible = true;
        });
      } else {
        Object.defineProperty(box, 'visible', {
          value: false
        })
        box.children.map(mesh => {
          mesh.visible = false;
        });
      }
    });
  }

}
