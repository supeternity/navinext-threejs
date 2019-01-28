
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
import SVG from '../helpers/svg';

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
    this.source = null;
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
      this.source = res;
    });
  }

  // ------------------------------------------------------
  //                                                    run
  // Call run() after all THREE.Loader's done, please
  // ------------------------------------------------------
  //
  run() {

    // Resources processing
    console.log('%c source processing : start ', 'background: #393D3F; color: #E76D83');

    // Replace inline styles
    // ⤷ For future css-support
    this.source = this.source.replace(/style=".*"/gm, '');
    console.log('replace inline: OK');

    // Normalized to https://www.w3.org/TR/SVG/
    // ⤷ 'serif:id' отсутствует в официальном стандарте:
    //   https://www.google.ru/search?q=site:https://www.w3.org/TR/SVG/+serif:id
    //   ⤷ заменён на 'class' https://www.w3.org/TR/SVG/styling.html#ClassAttribute
    this.source = this.source.replace(/serif:id=/gm, 'class=');
    console.log('w3 normalized: OK');

    // Convert all SVG-shapes to SVG-pathes
    new SVG();
    SVG.shapes2pathes(this.source).then(res => {

      if (res) {
        console.log('SVG-shapes to SVG-pathes: OK');
      }

      delete this.source;
      console.log('clear cache: OK');

      console.log('%c source processing : end ', 'background: #393D3F; color: #E76D83');

      // init world creating
      this.map.create(res);

    });

  }

}
