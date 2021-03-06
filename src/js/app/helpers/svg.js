
//                                       NAVINEXT-RENDER
// _____________________________________________________

//
// Special helper for Treejs ES6 build
// Timilink Company, 2018
//
// mail for support supraeternity@timilink.ru
//                  supraeternity@protonmail.com

//
// Logical:
// From d3-threeD.js

//
// specification 
//    http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
// example:
//    https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_shapes2.html
/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this file,
* You can obtain one at http://mozilla.org/MPL/2.0/. */

// ----------------------------------------------------- //
// usage example                                         //
// const myFlat = new SVGShape( your_svg_path );         //
//       myFlat.obj; // true THREE.Shape                 //
// ----------------------------------------------------- //

// Global imports -
import * as THREE from 'three';
// Convert SVG shapes to SVG paths
// ⤷ https://www.npmjs.com/package/shape2path
//   https://github.com/HarryStevens/shape2path#readme
import * as dRAW from 'shape2path';

const DIGIT_0 = 48;
const DIGIT_9 = 57;
const COMMA = 44;
const SPACE = 32;
const PERIOD = 46;
const MINUS = 45;
const DEGS_TO_RADS = Math.PI / 180;
// const UNIT_SIZE = 1; ??

let idx = 1, activeCmd,
  x = 0, y = 0, nx = 0, ny = 0, firstX = null, firstY = null,
  x1 = 0, x2 = 0, y1 = 0, y2 = 0,
  rx = 0, ry = 0, xar = 0, laf = 0, sf = 0, cx, cy;

const PATH = new THREE.ShapePath();

export default class SVG {

  constructor() {
    this.ThreeShape = [];
  }

  static shapes2pathes(SVG) {

    return new Promise(( resolve, reject ) => {
      // regexp dict
      // ⤷ rectangle: {
      //      source: full string-line shape : <rect * />
      //      inline: all inline-props of string-line : <* [inline-props] />
      //      differ: difference inline-props matching-groups: [1]: name, [2]: value
      //   }
      //
      const regexp = {
        rectangle: {
          source: /<rect .*/gm,
          inline: /[a-zA-Z]+[.*=]\S*|"\d*"|[a-zA-Z]+[.*=]"\d*.\d*"/gm,
          differ() {
            // is magic regexp for .exec method
            return /([a-zA-Z]*)="(\S*)"/gm;
          },
        }
      };
      // ___________________________________________________
      // SHAPE
      // ⤷ SVG-shape primitive's buffer
      //   ⤷ rectangle:
      //       .shapeType: https://www.w3schools.com/graphics/svg_rect.asp
      //       .search: all shapes items
      //       .shapes: objects array with [{difference one rectangle props}, ... {}]
      //     }
      const rectangle = {
        shapeType: 'rect',
        shapes: [],
      };
      //
      // ⤷  rectangle all shapes search
      const searchBuffer = SVG.match( regexp.rectangle.source );
      // ___________________________________________________
      // rectangle.shapes
      // ⤷  rectangle svg-shape difference props
      //    shapes model: [{
      //      source: string     - source line of SVG,
      //      props: {           - difference-inline props of inline[]
      //        - geometry:
      //          x: int,        - pivot px-point
      //          y: int,        - pivot px-point
      //          width: int,    - px
      //          height: int,   - px
      //        - semantic:
      //          id: string,    - NCName, unique identifier
      //          class: string  - for future: attribute assigns one or
      //                                       more class names to an element
      //      },
      //    },
      //    ...]
      if (searchBuffer !== null) {
        rectangle.shapes = searchBuffer.map( rectangle => {
          const tick = {
            source: rectangle,
            rect: {},
          };
          let inlineBuffer = null;
          // ⤷ full-xml property for difference properties object
          inlineBuffer = tick.source.match( regexp.rectangle.inline );
          // ___________________________________________________
          // properties
          // ⤷ dict for RECTANGLE.props
          const properties = {};
          inlineBuffer.map( rectangleInlineProperty => {
            // making matching groups
            const property = regexp.rectangle.differ().exec( rectangleInlineProperty );
            // making difference properties
            if ( property[1] !== undefined
              || property[2] !== undefined ) {
              if ( property[1] !== 'id'
                && property[1] !== 'class' ) {
                // use defineProperty because of imposible define
                // naming property from string element of array
                // impossible examples: 
                //   example = {
                //     property[1]: property[2],
                //   }
                //   example.property[1] = property[2]
                Object.defineProperty( properties, property[1], {
                  value: property[2],
                });
              } else {
                // use defineProperty because of imposible define
                // naming property from string element of array
                // impossible examples: 
                //   example = {
                //     property[1]: property[2],
                //   }
                //   example.property[1] = property[2]
                Object.defineProperty( properties, property[1], {
                  get: () => {
                    if ( property[1] === 'id' ) {
                      return 'id="' + property[2] + '" ';
                    } else if ( property[1] === 'class' ) {
                      return 'class="' + property[2] + '" ';
                    }
                  }, configurable: true,
                });
              }
            } else {
              reject('<rect../> diff crash');
            }
          });
          tick.rect = properties;
          return tick;
        });
      } else {
        resolve(SVG);
      }
      

      //                                 drawing rectangle's
      // ___________________________________________________
      rectangle.shapes.map((shape, i) => {
        // set path-drawing parameters
        const path = dRAW.rect({
          x: shape.rect.x,
          y: shape.rect.y,
          width: shape.rect.width,
          height: shape.rect.height,
        });
        // new string-line to replace
        if (path) {
          const str = '<path ' +
            (shape.rect.id ? shape.rect.id : '') +
            (shape.rect.class ? shape.rect.class : '') +
            'd="' + path + '" ' +
            '/>';
          // replacing source finalisation
          SVG = SVG.replace(shape.source, str);
          i === rectangle.shapes.length - 1 ?
            resolve(SVG) :
            '';
        } else {
          reject('<rect../> drawing crash');
        }
      });
    });
  }



      

  //               converting svg-pathes to three-shapes
  //               eatNum(), nextIsNum(), path()
  // ___________________________________________________

  eatNum() {

    let sidx, c, isFloat = false, s;

    // eat delims
    while (idx < this.pathStr.length) {
      c = this.pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE)
        break;
      idx++;
    }
    if (c === MINUS) {
      sidx = idx++;
    }
    else {
      sidx = idx;
    }
    // eat number
    while (idx < this.pathStr.length) {
      c = this.pathStr.charCodeAt(idx);
      if (DIGIT_0 <= c && c <= DIGIT_9) {
        idx++;
        continue;
      }
      else if (c === PERIOD) {
        idx++;
        isFloat = true;
        continue;
      }
      s = this.pathStr.substring(sidx, idx);
      return isFloat ? parseFloat(s) : parseInt(s);
    }

    s = this.pathStr.substring(sidx);
    return isFloat ? parseFloat(s) : parseInt(s);

  }

  nextIsNum() {
    var c;
    // do permanently eat any delims...
    while (idx < this.pathStr.length) {
      c = this.pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE)
        break;
      idx++;
    }
    c = this.pathStr.charCodeAt(idx);
    return (c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9));
  }

  path(src) {

    this.pathStr = src;
    
    let canRepeat;
    let enteredSub = false;
    activeCmd = this.pathStr[ 0 ];

    while (idx <= this.pathStr.length) {
      canRepeat = true;
      switch (activeCmd) {
        // moveto commands, become lineto's if repeated
        case 'M':
          enteredSub = false;
          x = this.eatNum();
          y = this.eatNum();
          PATH.moveTo(x, y);
          activeCmd = 'L';
          break;
        case 'm':
          x += this.eatNum();
          y += this.eatNum();
          PATH.moveTo(x, y);
          activeCmd = 'l';
          break;
        case 'Z':
        case 'z':
          // z is a special case. This ends a segment and starts
          // a new PATH. Since the three.js path is continuous
          // we should start a new path here. This also draws a
          // line from the current location to the start location.
          canRepeat = false;
          console.log('x, y: ', x, y);
          console.log('fX, fY: ', firstX, firstY);
          if (x !== firstX || y !== firstY)
            PATH.lineTo(firstX, firstY);

          // reset the elements
          firstX = null;
          firstY = null;

          // avoid x,y being set incorrectly
          enteredSub = true;

          break;
        // - lines!
        case 'L':
        case 'H':
        case 'V':
          nx = (activeCmd === 'V') ? x : this.eatNum();
          ny = (activeCmd === 'H') ? y : this.eatNum();
          PATH.lineTo(nx, ny);
          x = nx;
          y = ny;
          break;
        case 'l':
        case 'h':
        case 'v':
          nx = (activeCmd === 'v') ? x : (x + this.eatNum());
          ny = (activeCmd === 'h') ? y : (y + this.eatNum());
          PATH.lineTo(nx, ny);
          x = nx;
          y = ny;
          break;
        // - cubic bezier
        case 'C':
          x1 = this.eatNum(); y1 = this.eatNum();
          // fall through
        case 'S':
          if (activeCmd === 'S') {
            x1 = 2 * x - x2; y1 = 2 * y - y2;
          }
          x2 = this.eatNum();
          y2 = this.eatNum();
          nx = this.eatNum();
          ny = this.eatNum();
          PATH.bezierCurveTo(x1, y1, x2, y2, nx, ny);
          x = nx; y = ny;
          break;
        case 'c':
          x1 = x + this.eatNum();
          y1 = y + this.eatNum();
          // fall through
        case 's':
          if (activeCmd === 's') {
            x1 = 2 * x - x2;
            y1 = 2 * y - y2;
          }
          x2 = x + this.eatNum();
          y2 = y + this.eatNum();
          nx = x + this.eatNum();
          ny = y + this.eatNum();
          PATH.bezierCurveTo(x1, y1, x2, y2, nx, ny);
          x = nx; y = ny;
          break;
        // - quadratic bezier
        case 'Q':
          x1 = this.eatNum(); y1 = this.eatNum();
          // fall through
        case 'T':
          if (activeCmd === 'T') {
            x1 = 2 * x - x1;
            y1 = 2 * y - y1;
          }
          nx = this.eatNum();
          ny = this.eatNum();
          PATH.quadraticCurveTo(x1, y1, nx, ny);
          x = nx;
          y = ny;
          break;
        case 'q':
          x1 = x + this.eatNum();
          y1 = y + this.eatNum();
          // fall through
        case 't':
          if (activeCmd === 't') {
            x1 = 2 * x - x1;
            y1 = 2 * y - y1;
          }
          nx = x + this.eatNum();
          ny = y + this.eatNum();
          PATH.quadraticCurveTo(x1, y1, nx, ny);
          x = nx; y = ny;
          break;
        // - elliptical arc
        case 'A':
          rx = this.eatNum();
          ry = this.eatNum();
          xar = this.eatNum() * DEGS_TO_RADS;
          laf = this.eatNum();
          sf = this.eatNum();
          nx = this.eatNum();
          ny = this.eatNum();
          if (rx !== ry) {
            console.warn("Forcing elliptical arc to be a circular one :(",
              rx, ry);
          }
          // SVG implementation notes does all the math for us! woo!
          // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
          // step1, using x1 as x1'
          x1 = Math.cos(xar) * (x - nx) / 2 + Math.sin(xar) * (y - ny) / 2;
          y1 = -Math.sin(xar) * (x - nx) / 2 + Math.cos(xar) * (y - ny) / 2;
          // step 2, using x2 as cx'
          var norm = Math.sqrt(
            (rx*rx * ry*ry - rx*rx * y1*y1 - ry*ry * x1*x1) /
                  (rx*rx * y1*y1 + ry*ry * x1*x1));
          if (laf === sf)
            norm = -norm;
          x2 = norm * rx * y1 / ry;
          y2 = norm * -ry * x1 / rx;
          // step 3
          cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
          cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;

          var u = new THREE.Vector2(1, 0),
            v = new THREE.Vector2((x1 - x2) / rx,
              (y1 - y2) / ry);
          var startAng = Math.acos(u.dot(v) / u.length() / v.length());
          if (u.x * v.y - u.y * v.x < 0)
            startAng = -startAng;

          // we can reuse 'v' from start angle as our 'u' for delta angle
          u.x = (-x1 - x2) / rx;
          u.y = (-y1 - y2) / ry;

          var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
          // This normalization ends up making our curves fail to triangulate...
          if (v.x * u.y - v.y * u.x < 0)
            deltaAng = -deltaAng;
          if (!sf && deltaAng > 0)
            deltaAng -= Math.PI * 2;
          if (sf && deltaAng < 0)
            deltaAng += Math.PI * 2;

          PATH.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
          x = nx;
          y = ny;
          break;

        case ' ':
          // if it's an empty space, just skip it, and see if we can find a real command
          break;

        default:
          console.log(`weird path command: ${activeCmd}`);
      }
      if (firstX === null && !enteredSub) {
        firstX = x;
        firstY = y;
      }

      // just reissue the command
      if (canRepeat && this.nextIsNum())
        continue;
      activeCmd = this.pathStr[idx++];
    }
    
    this.ThreeShape = PATH.toShapes();

  }

}
