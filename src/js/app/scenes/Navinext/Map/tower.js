
// Global imports -
import * as THREE from 'three';

// Tower parts
import Floor from './tower/floor';

//                                  3DO library for Tower
//                                        Timilink © 2018
// ______________________________________________________

export default class Tower {

  constructor(scene, style, source) {
    this.scene = scene;
    // testing one floor (not array) in [this revision]*
    this.floor = {
      source: source.floor,
      mesh: [],
    };
    this.style = style;
  }

  build() {

    // init floors building
    // maping this.floors.source array for *[next revision]
    new Floor();
    Floor.build(this.floor.source, this.floor.mesh, this.style.floor);

  }

}
