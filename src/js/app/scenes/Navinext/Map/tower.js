
// Global imports -
import * as THREE from 'three';

// Tower parts
import Floor from './tower/floor';

//                                  3DO library for Tower
//                                        Timilink © 2018
// ______________________________________________________

export default class Tower {

  constructor(floor, style) {
    // testing one floor (not array) in [this revision]*
    this.floor = {
      source: floor,
      mesh: [],
    };
    this.style = style;
  }

  build(scene) {

    // init floors building
    // maping this.floors.source array for *[next revision]
    new Floor();
    Floor.build(
      this.floor.source,
      this.floor.mesh,
      this.style.floor
    );

    for (let i = 0; i <= this.floor.mesh.length - 1; i++) {
      scene.add(this.floor.mesh[i]);
      console.log(-50, this.floor.mesh[i]);
    }

  }

}
