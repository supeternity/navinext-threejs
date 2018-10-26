
//                                              NAVINEXT
// _____________________________________________________
//
//  This new features research-environment for XML-based
//              REALTIME RENDERING BUILDING PLANS IN WEB
//
//                          --                         
//
// team                 Dmitrii Mezenin, Dmitrii Raikov,     
//               Kristina Kungurova, Anton Vladimirov,
//          Artem Kuzvesov
//
//                       from Timilink company with love
// timilink.ru                      Yekaterinburg © 2018
// _____________________________________________________


// Global imports
import * as THREE from 'three';

// TT Config -
import Conf from './navinext/config';

// Runtime parts -
import shapes2path from './navinext/runtime/shapes2path';

// Scene parts -
import Map from './navinext/map';


// The Scene Main Class                              Maps
//
// Is abstract overlay for an app                        
// ______________________________________________________

export default class navinext {

  constructor(scene, manager) {

    // global runtime : THREE.Scene
    // https://threejs.org/docs/#api/en/scenes/Scene

    // global runtime : THREE.LoadingManager
    // https://threejs.org/docs/#api/en/loaders/managers/LoadingManager

    // loader https://threejs.org/docs/#api/en/loaders/FileLoader

    this.scene = scene;
    this.manager = manager;
    this.loader = new THREE.FileLoader(manager);
    this.svg = null;
    this.conf = Conf;
    this.style = this.conf.style;

    this.map = new Map(this.scene, this.style);

  }

  //
  //                                                  
  //                               The Scene Main Class API
  // ______________________________________________________

  // ------------------------------------------------------
  //                                                   load
  //
  // Load *[map_source].svg location set in ~/scene.conf
  // ------------------------------------------------------
  //
  // Only load static resources
  load() {
    this.loader.load(this.conf.source, res => {
      this.svg = res;
    });
  }

  // ------------------------------------------------------
  //                                                    run
  // Call run() after all THREE.Loader's done, please
  // ------------------------------------------------------
  //
  run() {

    // Resources processing

    // Replace inline styles
    // ⤷ For future css-support
    this.svg = this.svg.replace(/style=".*"/gm, '');

    // Normalized to https://www.w3.org/TR/SVG/
    // ⤷ 'serif:id' отсутствует в официальном стандарте:
    //   https://www.google.ru/search?q=site:https://www.w3.org/TR/SVG/+serif:id
    //   ⤷ заменён на 'class' https://www.w3.org/TR/SVG/styling.html#ClassAttribute
    this.svg = this.svg.replace(/serif:id=/gm, 'class=');

    // Convert all SVG-shapes to SVG-pathes
    new shapes2path();
    shapes2path.output(this.svg).then(res => {
      
      console.log(-2, res);
      this.svg = res;

      // init world creating
      this.map.create(this.svg);

    });

  }

}
