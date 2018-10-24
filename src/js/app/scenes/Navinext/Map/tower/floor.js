
// Global imports -
import * as THREE from 'three';

// Helpers -
import Shaper from '../../../../helpers/svg/path';
import Extruder from '../../../../helpers/extruder';

export default class Floor {

  constructor() {
    this.floors = null;
    this.style = null;
  }

  static build(floors, mesh, style) {
          
    this.floors = {
      source: floors,
      mesh: mesh,
    };
    this.style = style;

    this.floors.source.children.map((roomSource, i) => {

      const room = {
        shape: new Shaper( roomSource.children[0].attributes.d ),
        mesh: null,
      };

      room.mesh = new Extruder( room.shape.obj, this.style );
      room.mesh.obj.name = roomSource.attributes.id;

      this.floors.mesh.push( room.mesh.obj );

    });

  }  

}
