
//                                       Part of NAVINEXT
//                                   Timilink LLC. © 2018
// ______________________________________________________

// Convert SVG shapes to SVG paths
// ⤷ https://www.npmjs.com/package/shape2path
//   https://github.com/HarryStevens/shape2path#readme
import * as dRAW from 'shape2path';

export default class shapes2path {

  static output(SVG) {

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
      let searchBuffer = SVG.match( regexp.rectangle.source );
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

}
