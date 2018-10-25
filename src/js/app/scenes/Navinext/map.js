
// Global imports
import * as THREE from 'three';

// Local imports -
import SVGSON from 'svgson-next';

// Local imports
// Procedural SVG stack
import Tower from './map/tower';


//                                        All world parts
// ______________________________________________________

export default class Map {

  constructor(scene, conf, svg) {
    this.svg = svg;
    this.scene = scene;
    this.conf = conf;
    this.style = this.conf.style;
  }
  
  //                                              class API
  // ______________________________________________________

  create() {

    SVGSON.parse(this.svg).then(res => {

      // hyperlay draft ?
      let source = {
        floor: res.children[0].children[0].children[0],
      }
      
      this.tower = new Tower(this.scene, this.style, source);
      this.tower.build();

    });

  }

}
