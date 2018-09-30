
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
import Conf from './Maps/conf';

// Game parts -
import Stage from './Maps/stage';
//import NPC from './Maps/npc';


//                                                    Map
//
// You can test svg-analyse, edited 'Yeltsin1.svg' 
// ______________________________________________________

export default class Maps {

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
      let barber = res.replace(/style=".*"/gm, '');
      barber = barber.replace(/serif:id=/gm, 'class=');
      this.svg = barber;
    });
  }

  // ------------------------------------------------------
  //                                                    run
  // Call this after all loaders done, please
  // ------------------------------------------------------
  //
  run() {
    this.stage = new Stage( this.svg, this.scene );
    this.stage.create();
    // this.bot = new NPC( this.conf.bot.name );
    // this.bot.play( this.stage );
  }

}
