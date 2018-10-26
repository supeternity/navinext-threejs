
// Global imports -
import * as THREE from 'three';

// Helpers -
import SVG from '../../../../helpers/svg';
import Extruder from '../../../../helpers/extruder';

export default class Floor {

  constructor() {
    this.floor = null;
    this.style = null;
  }

  static build(floor, style) {
          
    this.floor = floor;
    this.style = style;

    this.floor.source.children.map(roomSource => {

      new SVG();
      SVG.path(roomSource.children[0].attributes.d);
      
      let room = new Extruder( SVG.Shape3D, this.style );
      room.obj.name = roomSource.attributes.id;

      this.floor.rooms.add( room.obj );

    });

    delete this.floor.source;

  }  

}
