
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________


// Global imports -
import * as THREE from 'three';

// TT Config -
import Conf from './conf';

// Local imports
import Cube from './cube';
import Cell from './cell';


//                                        Stage managment
// ______________________________________________________

export default class Stage {

  constructor( svg, scene ) {
    this.svg = svg;
    this.scene = scene;
    this.field = null;
    this.conf = Conf;
  }


  //                                          local methods
  // ______________________________________________________

  // ------------------------------------------------------
  //                                                    EMV
  //
  // Equilateral Matrix : Vectors from median to verts
  // This is very useful method - maybe move to Helpers?
  // ------------------------------------------------------
  // 
  EMV() {
    const side = Math.sqrt( this.conf.disposition.length );
    const median = Math.ceil( side / 2 );
    const buffer = [];
    const from = median - side;
    const to = side - median;
    for ( let l = from;
      l <= to;
      l += 1 ) {
      for ( let c = from;
        c <= to;
        c += 1 ) {

        buffer.push({
          x: c < 0 ? c - 1 : c > 0 ? c + 1 : c,
          z: l < 0 ? l - 1 : l > 0 ? l + 1 : l,
        });

      }
    }
    this.EMVBuffer = buffer;
  }

  // ------------------------------------------------------
  //                                                 create
  // XOB-field
  // ------------------------------------------------------
  //
  create() {
    this.EMV(); // init position-multipliers buffer
    const cube = new Cube();
    cube.convert( this.svg, Conf.model ).then(() => {
      this.dp.map(( value, i ) => {
        const cell = new Cell( i,
          cube.hyper,
          cube.hyper.userData.dimension,
          this.EMVBuffer[i] );
        cell.state( value );
        this.scene.add( cell.hyper );
      });
    }).catch(err => {
      console.error(`Create Cube: ${err}`);
    });
  }

  update() {

  }


  //                                              class API
  // ______________________________________________________

  disposition(dp) {
    this.dp = dp;
    this.field === null ? this.create() : this.update();
  }

}
