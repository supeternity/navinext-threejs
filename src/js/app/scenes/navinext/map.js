
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
  
  constructor(scene, style) {
    this.scene = scene;
    this.style = style;
  }

  //                                          local methods
  // ______________________________________________________

  //                                              class API
  // ______________________________________________________

  create(SVG) {

    SVGSON.parse(SVG).then(res => {

      // hyperlay draft ?
      let source = {
        floor: res.children[0].children[0].children[0],
      }
      
      this.tower = new Tower(this.style.tower, source);
      this.tower.build();

      this.scene.add( this.tower.floor.rooms );

    });

  }

}
