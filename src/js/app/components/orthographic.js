import * as THREE from 'three';

import Config from '../../data/config';

// Class that creates and updates the main camera
export default class Orthographic {
  constructor(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;

    // Create and position a Perspective Camera
    this.threeCamera = new THREE.OrthographicCamera( width / - Config.controls.orhtoZoom, width / Config.controls.orhtoZoom, height / Config.controls.orhtoZoom, height / - Config.controls.orhtoZoom, Config.orthographic.near, Config.orthographic.far );
    
    // Initial sizing
    this.updateSize(renderer);
    
    // Listeners
    window.addEventListener('resize', () => this.updateSize(renderer), false);
  }

  updateSize(renderer) {
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    this.threeCamera.left = width / - Config.controls.orhtoZoom;
    this.threeCamera.right = width / Config.controls.orhtoZoom;
    this.threeCamera.top = height / Config.controls.orhtoZoom;
    this.threeCamera.bottom = height / - Config.controls.orhtoZoom;
    this.threeCamera.updateProjectionMatrix();
  }
}
