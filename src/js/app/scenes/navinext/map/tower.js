
// Global imports -
import * as THREE from 'three';

// Tower parts
import Floor from './tower/floor';

//                                  3DO library for Tower
//                                        Timilink © 2018
// ______________________________________________________

export default class Tower {

  constructor(style, source) {
    this.floor = {
      source: source.floor,
      rooms: new THREE.Group(),
    };
    this.style = style;
  }

  build() {

    this.floor.rooms.name = 'rooms';

    new Floor();
    Floor.build(this.floor, this.style.floor);

  }

}
