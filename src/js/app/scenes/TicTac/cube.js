
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________

// Global imports -
import * as THREE from 'three';

// Local imports -
import SVGSON from 'svgson-next';

// Helpers -
import svgShape from '../../helpers/svgShape';
import svgExtrude from '../../helpers/svgExtrude';


//                                 3DO library for Cell's
// ______________________________________________________

export default class Cube {

  constructor() {
    this.hyper = null;
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
    return new Promise(resolve => {
      const res = [];
      source.children.map((el, i) => {
        const conv = {
          name: el.attributes.id,
          paths: el.children.map(_el => {
            return {
              class: _el.attributes.class,
              d: _el.attributes.d,
            }
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
    return new Promise(resolve => {
      const res = [];
      source.map((el, i) => {
        const conv = {
          name: el.name,
          shapes: el.paths.map(_el => {
            const shape = new svgShape( _el.d );
            return {
              class: _el.class,
              shape: shape.obj,
            }
          }),
          props: this.conf,
        };
        res.push( conv );
        i === source.length - 1 ? resolve(res) : ' ';
      });
    });
  }

  // ------------------------------------------------------
  //                                                  hyper
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
      
      const res = new THREE.Group();
      res.name = 'hypercube';
      source.map((el, i) => {
        const model = new THREE.Group();

        model.name = el.name;
        el.shapes.map(_el => {
          const extruder = new svgExtrude( _el, el.props );
          const mesh = extruder.obj;
          mesh.name = `${el.name}-${_el.class}`;
          model.add( mesh );
        });
        res.add( model );
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
  convert( svg, conf ) {

    this.conf = conf;

    if(!this.hyper) {

      return new Promise((resolve, reject) => {

        SVGSON.parse( svg ).then(res => {
          // SVGSON to mustdata juice
          this.disassembly(res).then(res => {
            // convert d to true THREE.Shape objects
            this.shapes(res).then(res => {
              this.shapes = res;
              console.dir(this.shapes);
              // convert all curves to true THREE.Mesh objects
              this.meshes(res).then(res => {
                // set local instance
                const hyper = res;
                // extend hypercube properties
                const bounding = new THREE.Box3();
                bounding.setFromObject( hyper );
                Object.defineProperty(hyper.userData, 'dimension', {
                  value: bounding.getSize(),
                });
                this.hyper = hyper;
                // ok
                resolve();

              }).catch(err => {
                // meshes catch -
                reject(`Hypercube: Crash: ${err}`);
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

}
