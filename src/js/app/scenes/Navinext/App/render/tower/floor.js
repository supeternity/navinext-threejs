
// Global imports -
import * as THREE from 'three';

// Helpers -
import svgShape from '../../../../../helpers/svgShape';
import svgExtruder from '../../../../../helpers/svgExtrude';

export default class Floor {

  constructor() {
    this.floors = null;
    this.style = null;
  }

  static build(floors, floorContainer, style) {
          
    this.floors = {
      source: floors,
      container: floorContainer,
    };
    this.style = style;

    this.floors.source.children.map((roomSource, i) => {

      const room = {
        shape: new svgShape( roomSource.children[0].attributes.d ),
        mesh: null,
      };
      
      console.log(2, 'tick: ', i);
      console.log(3, room.shape.obj);
      console.log(4, roomSource.attributes.id);

      room.mesh = new svgExtruder( room.shape.obj, this.style );
      room.mesh.obj.name = roomSource.attributes.id;

      console.log(5, room.mesh.obj);

      this.floors.container.add( room.mesh.obj );

    });

    console.log(4, this.floors.rooms);

  }  

}
