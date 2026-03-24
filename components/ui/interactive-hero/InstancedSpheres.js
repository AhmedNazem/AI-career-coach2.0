import {
  Vector2,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  MeshPhysicalMaterial,
  Color,
  AmbientLight,
  PointLight,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { W } from "./PhysicsEngine";

const U = new Object3D();

export class Z extends InstancedMesh {
  config;
  physics;
  ambientLight;
  light;
  constructor(renderer, params) {
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(renderer)).texture;
    pmrem.dispose();
    const geometry = new SphereGeometry(1, 24, 24);
    const material = new MeshPhysicalMaterial({
      envMap: envTexture,
      ...params.materialParams,
    });
    super(geometry, material, params.count);
    this.config = params;
    this.physics = new W(this.config);
    this.ambientLight = new AmbientLight(0xffffff, params.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(0xffffff, params.lightIntensity, 100, 1);
    this.add(this.light);
    this.setColors(this.config.colors);
  }

  setColors(colors) {
    if (!Array.isArray(colors) || !colors.length) return;
    const colorObjs = colors.map((c) =>
      c instanceof Color ? c : new Color(c)
    );
    for (let i = 0; i < this.count; i++)
      this.setColorAt(i, colorObjs[i % colorObjs.length]);
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  update(deltaInfo) {
    this.physics.update(deltaInfo);
    for (let i = 0; i < this.count; i++) {
      U.position.fromArray(this.physics.positionData, 3 * i);
      U.scale.setScalar(this.physics.sizeData[i]);
      U.updateMatrix();
      this.setMatrixAt(i, U.matrix);
    }
    this.instanceMatrix.needsUpdate = true;
    if (this.config.controlSphere0)
      this.light.position.fromArray(this.physics.positionData, 0);
  }
}

export const pointer = new Vector2();
export function onPointerMove(e) {
  pointer.set(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
}
