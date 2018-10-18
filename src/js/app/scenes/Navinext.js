
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
import Conf from './Navinext/conf';

// Runtime parts -
import shapes2path from './Navinext/app/runtime/shapes2path';

// Scene parts -
import Map from './Navinext/App';


// The Scene Main Class                              Maps
//
// Is abstract overlay for an app                        
// ______________________________________________________

export default class Navinext {

  constructor(scene, manager) {

    // global runtime : THREE.Scene
    // https://threejs.org/docs/#api/en/scenes/Scene

    // global runtime : THREE.LoadingManager
    // https://threejs.org/docs/#api/en/loaders/managers/LoadingManager

    // loader https://threejs.org/docs/#api/en/loaders/FileLoader

    this.scene = scene;
    this.manager = manager;
    this.loader = new THREE.FileLoader(manager);
    this.conf = Conf;
    this.style = this.conf.style;

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
  load() {
    this.loader.load(this.conf.source, res => {

      // Replace inline styles
      // ⤷ For future the full css-support
      let SVG = res.replace(/style=".*"/gm, '');

      // Normalized to https://www.w3.org/TR/SVG/
      // ⤷ 'serif:id' отсутствует в официальном стандарте:
      //   https://www.google.ru/search?q=site:https://www.w3.org/TR/SVG/+serif:id
      //   ⤷ заменён на 'class' https://www.w3.org/TR/SVG/styling.html#ClassAttribute
      SVG = SVG.replace(/serif:id=/gm, 'class=');

      // Convert all SVG-shapes to SVG-pathes
      new shapes2path();
      shapes2path.output(SVG).then(res => {
        this.svg = res;
      }).catch(err => {
        console.log('shape2path error: ' + err);
      });

      // making the Map
      this.map = new Map(this.svg);
      this.map.create();

    });
  }

  // ------------------------------------------------------
  //                                                    run
  // Call run() after all THREE.Loader's done, please
  // ------------------------------------------------------
  //
  run() {
    console.log('Run map stage in continuum');
    // this.scene.add( this.map.stage );
  }

}
