
// Global imports -
import * as THREE from 'three';

// Tower parts
import Floor from './tower/floor';

//                                  3DO library for Tower
//                                        Timilink © 2018
// ______________________________________________________

export default class Tower {

  constructor(floors, style) {
    // testing one floor (not array) in [this revision]*
    this.floors = {
      source: floors,
      container: new THREE.Group(),
    };
    this.style = style;
    this.floors.container.name = 'floors';
  }

  build() {

    // init floors building
    // maping this.floors.source array for *[next revision]
    new Floor();
    Floor.build(this.floors.source, this.floors.container, this.style.floor);

  }

}
