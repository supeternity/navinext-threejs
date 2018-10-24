
// Global imports
import * as THREE from 'three';

// Scene Config -
import Conf from './conf';

// Local imports -
import SVGSON from 'svgson-next';

// Local imports
// Procedural SVG stack
import Tower from './App/render/tower';


//                                        All world parts
// ______________________________________________________

export default class Map {

  constructor(svg, scene) {
    this.svg = svg;
    this.scene = scene;
    this.conf = Conf;
    this.style = this.conf.style;
  }
  
  //                                              class API
  // ______________________________________________________

  create() {

    SVGSON.parse(this.svg).then(res => {
      this.tower = new Tower(res.children[0].children[0].children[0], this.style);
      this.tower.build();
      this.scene.add( this.tower.floors.container );

      console.log(1, this.tower.floors.container);
      console.log(0, this.scene);

    });

  }

}
