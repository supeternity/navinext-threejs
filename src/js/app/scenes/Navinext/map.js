
// Global imports
import * as THREE from 'three';

// Local imports -
import SVGSON from 'svgson-next';

// Local imports
// Procedural SVG stack
import Tower from './Map/tower';


//                                        All world parts
// ______________________________________________________

export default class Map {

  constructor(svg, conf, scene) {
    this.svg = svg;
    this.scene = scene;
    this.conf = conf;
    this.style = this.conf.style;
  }
  
  //                                              class API
  // ______________________________________________________

  create() {

    SVGSON.parse(this.svg).then(res => {
      
      this.tower = new Tower(res.children[0].children[0].children[0], this.style);
      this.tower.build(this.scene);

      console.log(-20, this.scene);

    });

  }

}
