import * as THREE from 'three';

import Config from '../../data/config';

// Class that creates and updates the main camera
export default class Orthographic {
  constructor(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;

    // Create and position a Perspective Camera
    this.threeCamera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, Config.orthographic.near, Config.orthographic.far );
    this.threeCamera.position.set(Config.orthographic.posX, Config.orthographic.posY, Config.orthographic.posZ);
    this.threeCamera.rotation.order = 'YXZ';
    this.threeCamera.rotation.y = - Math.PI / 4;
    this.threeCamera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
    
    // Initial sizing
    this.updateSize(renderer);
    
    // Listeners
    window.addEventListener('resize', () => this.updateSize(renderer), false);
  }

  updateSize(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    this.threeCamera.left = width / - 2;
    this.threeCamera.right = width / 2;
    this.threeCamera.top = height / 2;
    this.threeCamera.bottom = height / - 2;
    this.threeCamera.updateProjectionMatrix();
  }
}
