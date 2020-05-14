import * as THREE from './build/three.module.js';
//import { createBillboard, createText } from './scs/helperfunctions.js';
import { createMap } from './scs/thesentinel.js';
import { create2DArray } from './scs/collections.js';
import { getRandomInt } from './scs/numberfunctions.js';
import { createBillboard, createPlane_NoTex, createCuboid } from './scs/helperfunctions.js';


/*
ECS Components:-
face - Always face the camera
text - Text to show if player pointing at it.
absorb - energy gained fom absorption
//land - can be landed on


*/


	var selectables;
	var scene, dolly;
	var loader = undefined; // Texture loader
	var map = undefined;
	var entities = undefined; // Anything that can be selected
	
	var selectedObject;
	var selectedPoint;
	
	var highlight = undefined;
	
	var tempMatrix = new THREE.Matrix4();
	var raycaster = new THREE.Raycaster();
	const clock = new THREE.Clock();

	export function initGame(_scene, _dolly) {
		scene = _scene;
		dolly = _dolly;
		
		loader = new THREE.TextureLoader();
		
		entities = new THREE.Group();
		scene.add(entities);
		
		var light = new THREE.DirectionalLight( 0x00ff00, 1, 100 );
		light.position.set( 0, 1, 0 );
		light.target.position.set( 0, 0, 0 );
		light.castShadow = true;
		scene.add( light );

		scene.background = new THREE.Color( 0x666666 );

		createCuboid(loader, 'textures/thesentinel/lavatile.jpg', .2, function(cube) {
			highlight = cube;
			scene.add(cube);
		});

		// Generate map
		const SIZE = 40;
		var x, y;
		map = create2DArray(SIZE); // Array of heights of corners of each plane
		for (y=0 ; y<SIZE-1 ; y+=2) {
			for (x=0 ; x<SIZE-1 ; x+=2) {
				var rnd = getRandomInt(0, 1);
				map[x][y] = rnd;
				map[x+1][y] = rnd;
				map[x][y+1] = rnd;
				map[x+1][y+1] = rnd;
			}
		}

// todo =- remove
				map[0][0] = 1;
				map[1][0] = 1;
				map[0][1] = 1;
				map[1][1] = 1;


		var mapent = createMap(map, SIZE);
		mapent.position.y = -1;
		mapent.position.z = -SIZE;
		entities.add(mapent);

		/*
		

		for (y=0 ; y<SIZE-1 ; y++) {
			for (x=0 ; x<SIZE-1 ; x++) {
				var plane = createPlane_NoTex(map[x][y], map[x+1][y], map[x][y+1], map[x+1][y+1]);
				plane.position.x = x;
				plane.position.y = 0;
				plane.position.z = -y;
				entities.add(plane);
			}
		}
		*/
		
		// Set player start position
		dolly.position.x = 0;
		dolly.position.y = map[0][0];
		dolly.position.z = 0;


		//this.text = createText("HELLO!");
		//this.text.position.set(0, 2, -5);
		//scene.add(this.text)
	}
	

	function currentPointer(object, point) {
		selectedObject = object;
		if (object != undefined) {
			selectedPoint = point;
			//object.material.color.setHex(0xff0000);
			if (highlight != undefined) {
				highlight.position.x = point.x;
				highlight.position.y = point.y + .1;
				highlight.position.z = point.z;
			}
		}
	}
	
	
	export function onSelectStart() {
		//console.log('onSelectStart()');
		if (selectedObject != undefined) {
			//console.log("this.selectedObject.position=" + selectedObject.position);
			//console.log("this.selectedObject.position.x=" + selectedObject.position.x);
			//console.log("this.selectedObject.position.z=" + selectedObject.position.z);

			dolly.position.x = selectedPoint.x;
			dolly.position.y = selectedPoint.y + .1;
			dolly.position.z = selectedPoint.z;
		}
	}

	
	export function onSelectEnd() {
		//console.log('onSelectEnd()');
	}


	export function updateGame(scene, dolly, controller) {
		var delta = clock.getDelta();

		// find what user is pointing at
		tempMatrix.identity().extractRotation( controller.matrixWorld );
		raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
		raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );

		var intersects = raycaster.intersectObjects(entities.children);

		if (intersects.length > 0) {
			//console.log("Intersected!");
			//intersectedObject = intersects[0].object;
			//intersectedPosition = intersects[0].point;

			// Rotate the object to show it is selected
			//intersectedObject.rotation.y += .1;
			currentPointer(intersects[0].object, intersects[0].point);

		} else {
			//intersectedObject = undefined;
		}
				

/*		var s;
		
		for (s of scene.children) {
			if (s.components) {
				// Point to face camera
				if (s.components["face"] != undefined) {
					s.rotation.y = Math.atan2( ( dolly.position.x - s.position.x ), ( dolly.position.z - s.position.z ) );
				}
			}
		}
*/
	}
//}

