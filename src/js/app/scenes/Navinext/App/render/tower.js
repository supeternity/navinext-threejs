
//                                              NAVINEXT
// _____________________________________________________

// Global imports -
import * as THREE from 'three';

// Helpers -
import svgShape from '../../../../helpers/svgShape';
import svgExtruder from '../../../../helpers/svgExtrude';


//                          3DO library for Tower floor's 
//                                   Timilink LLC. © 2018
// ______________________________________________________

export default class Tower {

  constructor( svg, style ) {
    this.svg = svg;
    this.style = style;

    this.floors = [];
    this.directions = {
      starts: [],
      ways: [],
      doors: [],
    };
  }



  // ------------------------------------------------------
  //                                            disassembly
  //   -  - --(SVGSON)
  // full- SVG - ->- JSON cdropp to local objects
  // ------------------------------------------------------
  // 
  // a r g u m e n t s
  //    source - SVGSON
  // 
  // p a r t s
  //    run parallel hyperlay
  //
  // r e t u r n
  //    res.building[] - d-pathes for objects
  //    res.directions[] - indexed waylines for TSP
  //    res.background[] - placed your build on Earth
  //    
  // ------------------------------------------------------
  // 
  disassembly(source) {

    console.log('%c SVGSON disassembly to working JSON processing ... ',
      'background: #00FFB6; color: #210FFF');
    
    return new Promise(resolve => {
      
      const stack = [];

      source.children.map((el) => {
        if (el.attributes.id === 'building') {
          el.children.map(_el => {
            _el.children.map(__el => {
              stack.push(this.hyperlay(__el));
            });
          });
        } else if (el.attributes.id === 'background') {
          stack.push(this.hyperlay(el));
        }
      });

      // console.log(`%c working JSON stack: `,
      //   'background: #FFFFFF; color: #CCCCCC');
      // console.dir(stack);

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
      console.log(`%c model: `);
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

      // console.log('%c SVG source: ', 'background: #3f87a6; color: #eee');
      // console.dir( this.svg );

      SVGSON.parse( this.svg ).then(res => {

        console.log('%c SVGSON: ', 'background: #3f87a6; color: #eee');
        console.log(res);

        // SVGSON to mustdata juice
        this.disassembly(res).then(res => {

          console.log(res);

          // convert d to true THREE.Shape objects
          this.shapes(res).then(res => {

            console.log(res.meshes);

            // convert all curves to true THREE.Mesh objects
            this.meshes(res.meshes).then(res => {

              console.log(res);

              // set local instance
              const obj = res;
              this.obj = obj;

              // ok
              resolve();

            // meshes catch -
            }).catch(err => {
              reject(`Meshes: Crash: ${err}`);
            });

          // shapes catch -
          }).catch(err => {
            reject(`Curves: Crash: ${err}`);
          });

        // disassembly catch -
        }).catch(err => {
          reject(`Source: Disassembly crash: ${err}`);
        });
  
      }).catch(err => {

        reject(`Processing SVGSON in Cube part: ${err}`);

      });

    });

  } 

}
