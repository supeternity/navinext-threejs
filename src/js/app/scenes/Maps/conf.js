
//                                  NAVINEXT-RENDER Demo
// _____________________________________________________

export default {
  source: './assets/models/svg/maps/debug/debug-waypoints.svg',
  disposition: ['b', 'o', 'x', 'o', 'b', 'o', 'x', 'o', 'b'],
  player: 'x',
  bot: {
    name: 'Cyber Boroday',
  },

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
    wall: false,
    depth: {
      room: 40,
    },
    color: {
      room: '#FFFFFF',
    },
    shadows: {
      room: true,
    },
  },
}
