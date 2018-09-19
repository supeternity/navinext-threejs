
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________
//
//  This new features research-environment for XML-based
//         REALTIME RENDERING BUILDING PLANS IN NAVINEXT
//
//                          --                         
//
// team: Dmitrii Mezenin, Dmitrii Raikov,     
//       Kristina Kungurova, Anton Vladimirov    
//
//                       from Timilink company with love
// timilink.ru                        Yekaterinburg 2018
// _____________________________________________________


// Global imports
import * as THREE from 'three';

// TT Config -
import Conf from './TicTac/conf';

// Game parts -
import Stage from './TicTac/stage';
//import NPC from './TicTac/npc';


//                          Classical game for example 🕷
//
// You can test svg-analyse, edited 'cube.svg' asset-file
// ______________________________________________________

export default class TicTac {

  constructor( scene, manager ) {
    this.scene = scene;
    this.manager = manager;
    this.loader = new THREE.FileLoader(manager);
    this.conf = Conf;
  }


  //                                          local methods
  // ______________________________________________________

  // method() .. 

  //                                         Main class API
  // ______________________________________________________

  // ------------------------------------------------------
  //                                                   load
  //
  // Attach this scene assets to global THREE loading stack
  // find an assets in ~/scene.conf
  // ------------------------------------------------------
  //
  load() {
    this.loader.load( this.conf.source, res => {
      this.svg = res;
    });
  }

  // ------------------------------------------------------
  //                                                    run
  // Call this after all loaders done, please
  // ------------------------------------------------------
  //
  run() {
    this.stage = new Stage( this.svg, this.scene );
    this.stage.disposition( this.conf.disposition );

    // this.bot = new NPC( this.conf.bot.name );
    // this.bot.play( this.stage );
  }

}
