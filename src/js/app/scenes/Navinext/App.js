
//                                              NAVINEXT
// _____________________________________________________


// Scene Config -
import Conf from './conf';

// Local imports -
import SVGSON from 'svgson-next';

// Local imports
// Procedural SVG stack
import Tower from './app/render/tower';


//                                        Scene managment
// ______________________________________________________

export default class Map {

  constructor(svg) {
    this.svg = svg;
    this.conf = Conf;
    this.style = this.conf.style;
  }

  //                                          local methods
  // ______________________________________________________
  
  // ------------------------------------------------------
  //                                            hyperLaying
  // asynch 3DLayouts
  // ------------------------------------------------------
  //
  hyperLaying() {
    
  }
  
  //                                              class API
  // ______________________________________________________
  
  create() {
    SVGSON.parse
  }

}
