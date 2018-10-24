
export default {
  source: './assets/models/svg/maps/debug/debug-floor.svg',


  // ------------------------------------------------------
  //                                            specs style
  //
  //      wall: bool
  //            extruded with or without walls
  //
  //     depth: int
  //            extruded label
  //
  //     color: https://threejs.org/docs/#api/en/math/Color
  //            material color
  //
  //   shadows: bool
  //            cast or no-cast
  //        
  // ------------------------------------------------------
  //
  style: {
    floor: {
      room: {
        depth: 40,
        flooring: 'silverGrid',
        color: '#FFFFFF',
        shadows: true,
      }
    }
  },
}
