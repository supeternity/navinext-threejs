
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________

// Global imports -
import * as THREE from 'three';

// Local imports -
import SVGSON from 'svgson-next';

// Helpers -
import svgShape from '../../helpers/svgShape';
import svgExtruder from '../../helpers/svgExtruder';


//                                 3DO library for Cell's
// ______________________________________________________

export default class Building {

  constructor( svg, css ) {
    this.svg = svg;
    this.css = css;
    this.walls = null;
  }

  //                                          local methods
  // ______________________________________________________

  // ------------------------------------------------------
  //                                            disassembly
  //   -  - --(SVGSON)
  // full- SVG - ->- JSON cdropp to local object
  // ------------------------------------------------------
  // 
  // a r g u m e n t s
  //    source - SVGSON
  // 
  // p a r t s
  //    source.children[0] ... .children[n] - SVG layers
  //
  // r e t u r n
  //    tree array[] with like your scene structure
  //
  // ------------------------------------------------------
  // 
  disassembly(source) { // <-- рекурсивно пройтись
    console.log('%c Working JSON: ', 'background: #3f87a6; color: #eee');
    return new Promise(resolve => {
      const res = [];
      source.children.map((el, i) => {
        const conv = {
          id: el.attributes.id,
          curves: el.children.map(_el => {
            return ({
              class: _el.attributes.class,
              d: _el.attributes.d,
            });
          }),
        };
        res.push( conv );
        i === source.children.length - 1 ? resolve(res) : ' ';
      });
    });
  }

  // ------------------------------------------------------
  //                                                 shapes
  //
  // THREE.Shape's fabric from d-pathes
  // ------------------------------------------------------
  //
  // a r g u m e n t s
  //    source - clear object from SVGSON source
  //
  // p a r t s
  //    source.children[0] ... .children[n] - SVG layers
  //
  // r e t u r n
  //    tree array[] with THREE.Shapes and meta for this
  //
  // ------------------------------------------------------
  //
  shapes(source) {
    console.log('%c shapes: ', 'background: #3f87a6; color: #eee');
    return new Promise(resolve => {
      const res = [];
      source.map((el, i) => {
        const conv = {
          name: el.id,
          curves: el.curves.map(_el => {
            const shape = new svgShape( _el.d );
            return ({
              class: _el.class,
              shape: shape.obj,
            });
          }),
          props: this.css,
        };
        res.push( conv );
        i === source.length - 1 ? resolve(res) : ' ';
      });
    });
  }

  // ------------------------------------------------------
  //                                                  walls
  //
  // THREE.Mesh'es fabric from THREE.Shape's
  // ------------------------------------------------------
  //
  // a r g u m e n t s
  //    source - THREE.Shape's array
  //
  // p a r t s
  //    mesh - specific obj by THREE.ExtrudeGeometry method
  //
  // r e t u r n
  //    promise :
  //    array[] with THREE.Group
  //    it is new collection for scene assembly
  //
  // ------------------------------------------------------
  //
  meshes(source) {
    return new Promise(resolve => {
      console.log(`%c model: `, 'background: #3f87a6; color: #eee');
      const res = [];
      source.map((el, i) => {
        const model = new THREE.Group();
        model.name = el.name;
        el.curves.map(_el => {
          const extruder = new svgExtruder( _el, el.props );
          const mesh = extruder.obj;
          mesh.name = `${el.name}-${_el.class}`;
          model.add( mesh );
        });
        res.push( model );
        i === source.length - 1 ? resolve(res) : ' ';
      });
    });
  }

  
  //                                              class API
  // ______________________________________________________

  // ------------------------------------------------------
  //                                                convert
  //
  // Generate states-collection for cells, (no-cache)
  // ------------------------------------------------------
  //
  convert() {

    return new Promise((resolve, reject) => {

      console.log('%c SVG source: ', 'background: #3f87a6; color: #eee');
      console.dir( this.svg );

      SVGSON.parse( this.svg ).then(res => {
        console.log('%c SVGSON: ', 'background: #3f87a6; color: #eee');
        console.dir(res);

        // SVGSON to mustdata juice
        this.disassembly(res).then(res => {
          console.dir(res);
          // convert d to true THREE.Shape objects
          this.shapes(res).then(res => {
            console.dir(res);
            // convert all curves to true THREE.Mesh objects
            this.meshes(res).then(res => {
              console.dir(res);

              // set local instance
              const obj = res;
              this.obj = obj;

              // ok
              resolve();

            }).catch(err => {
              // meshes catch -
              reject(`Cube: Crash: ${err}`);
            });
          }).catch(err => {
            // shapes catch -
            reject(`Curves: Crash: ${err}`);
          });
        }).catch(err => {
          // disassembly catch -
          reject(`Source: Disassembly crash: ${err}`);
        });
  
      }).catch(err => {

        reject(`Processing SVGSON in Cube part: ${err}`);

      });

    });
  } 

}
