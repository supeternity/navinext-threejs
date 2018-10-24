
//                                       Part of NAVINEXT
//                                   Timilink LLC. © 2018
// ______________________________________________________

// Convert SVG shapes to SVG paths
// ⤷ https://www.npmjs.com/package/shape2path
//   https://github.com/HarryStevens/shape2path#readme
import * as dRAW from 'shape2path';

export default class shapes2path {

  static output(SVG) {

    return new Promise((resolve, reject) => {
      // REGEXP
      // ⤷ REGEXP's dict
      //   rectangle: full string-line shape
      //      inline: all inline-props of string-line
      //       differ: matching-groups: [1]: name, [2]: value
      const REGEXP = {
        rectangle: {
          source: /<rect .*/gm,
          inline: /[a-zA-Z]+[.*=]\S*|"\d*"|[a-zA-Z]+[.*=]"\d*.\d*"/gm,
          differ() {
            // is magic REGEXP for .exec method
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
      //       .dif: objects array with [{difference one rectangle props}, ... {}]
      //     }
      const SHAPE = {
        rectangle: {
          shapeType: 'rect',
          search: null,
          dif: [],
        },
      };
      //
      // ⤷  rectangle all shapes search
      SHAPE.rectangle.search = SVG.match(REGEXP.rectangle.source);
      // ___________________________________________________
      // SHAPE.rectangle.dif
      // ⤷  rectangle svg-shape difference props
      //    SHAPE.diff model: [{
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
      SHAPE.rectangle.dif = SHAPE.rectangle.search.map(rectangle => {
        const RECTANGLE = {
          source: rectangle,
          inline: null, // a middle buffer
          rect: {},
        };
        // ___________________________________________________
        // RECTANGLE.inline
        // ⤷ full-xml property for difference PROPERTIES object
        RECTANGLE.inline = RECTANGLE.source.match(
          REGEXP.rectangle.inline
        );
        // ___________________________________________________
        // PROPERTIES
        // ⤷ dict for RECTANGLE.props
        const PROPERTIES = {};
        RECTANGLE.inline.map(rectangleInlineProperty => {
          // making matching groups
          const PROPERTY = REGEXP.rectangle.differ().exec(rectangleInlineProperty);
          // making difference properties
          if ( PROPERTY[1] !== undefined
            || PROPERTY[2] !== undefined ) {
            if ( PROPERTY[1] !== 'id'
              && PROPERTY[1] !== 'class' ) {
              Object.defineProperty(PROPERTIES, PROPERTY[1], {
                value: PROPERTY[2],
              })
            } else {
              Object.defineProperty(PROPERTIES, PROPERTY[1], {
                get: () => {
                  if (PROPERTY[1] === 'id') {
                    return 'id="' + PROPERTY[2] + '" ';
                  } else if (PROPERTY[1] === 'class') {
                    return 'class="' + PROPERTY[2] + '" ';
                  }
                }
              })
            }
          } else {
            reject('<rect../> diff crash');
          }
        });
        RECTANGLE.rect = PROPERTIES;
        delete RECTANGLE.inline;
        return RECTANGLE;
      });

      //                                 drawing rectangle's
      // ___________________________________________________
      SHAPE.rectangle.dif.map((shape, i) => {
        // set path-drawing parameters
        const D_PATH = dRAW.rect({
          x: shape.rect.x,
          y: shape.rect.y,
          width: shape.rect.width,
          height: shape.rect.height,
        });
        // new string-line to replace
        if (D_PATH) {
          const STR = '<path ' +
            (shape.rect.id ? shape.rect.id : '') +
            (shape.rect.class ? shape.rect.class : '') +
            'd="' + D_PATH + '" ' +
            '/>';
          // replacing source finalisation
          SVG = SVG.replace(shape.source, STR);
          i === SHAPE.rectangle.dif.length - 1 ?
            resolve(SVG) :
            '';
        } else {
          reject('<rect../> drawing crash');
        }
      });

    });
  }

}
