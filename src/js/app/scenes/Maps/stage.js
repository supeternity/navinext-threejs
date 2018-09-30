
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________


// Scene Config -
import Conf from './conf';

// Local imports
// Procedural SVG stack
import Building from './building';


//                                        Stage managment
// ______________________________________________________

export default class Stage {

  constructor( svg, scene ) {
    this.svg = svg;
    this.scene = scene;
    this.conf = Conf;
    this.style = this.conf.style;
  }


  //                                          local methods
  // ______________________________________________________

  // ------------------------------------------------------
  //                                                 create
  // map
  // ------------------------------------------------------
  //
  create() {

    const building = new Building( this.svg, this.style );

    building.convert().then(() => {

      building.obj.map( build => {
        this.scene.add( build );
      });

    }).catch(err => {
      console.error(`Create a building: ${err}`);
    });
    
  }


  //                                              class API
  // ______________________________________________________

  

}
