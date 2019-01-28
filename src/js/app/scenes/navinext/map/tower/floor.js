import SVG from '../../../../helpers/svg';
import Extruder from '../../../../helpers/extruder';

export default class Floor {

  static build( floor, style ) {
          
    this.floor = floor;
    this.style = style;

    console.log('%c floor processing : start ', 'background: #9CC4B2; color: #393D3F');
    this.floor.source.children.map(roomSource => {

      console.log(roomSource.attributes.id);

      console.log(0, `process for ${roomSource.children[0].attributes.id}`);
      console.log(1, `with path: ${roomSource.children[0].attributes.d}`);

      // this SVG combiner converting svg-paths to THREE.Shapes
      const shapeConverter = new SVG();
      shapeConverter.path( roomSource.children[0].attributes.d );

      console.log(2, shapeConverter.ThreeShape);
      
      const room = new Extruder( shapeConverter.ThreeShape, this.style );
      room.obj.name = roomSource.attributes.id;
      
      this.floor.rooms.add( room.obj );

    });

    delete this.floor.source;
    console.log('clear cache: OK');

    console.log('%c floor processing : end ', 'background: #9CC4B2; color: #393D3F');

  }  

}
