import { Vector3, MathUtils } from "three";

export class W {
  config;
  positionData;
  velocityData;
  sizeData;
  center = new Vector3();

  constructor(config) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count);
    this.velocityData = new Float32Array(3 * config.count);
    this.sizeData = new Float32Array(config.count);
    this.#initializePositions();
    this.setSizes();
  }

  #initializePositions() {
    const { count, maxX, maxY, maxZ } = this.config;
    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < count; i++) {
      const idx = 3 * i;
      this.positionData[idx] = MathUtils.randFloatSpread(2 * maxX);
      this.positionData[idx + 1] = MathUtils.randFloatSpread(2 * maxY);
      this.positionData[idx + 2] = MathUtils.randFloatSpread(2 * maxZ);
    }
  }

  setSizes() {
    const { count, size0, minSize, maxSize } = this.config;
    this.sizeData[0] = size0;
    for (let i = 1; i < count; i++)
      this.sizeData[i] = MathUtils.randFloat(minSize, maxSize);
  }

  update(deltaInfo) {
    const { config, center, positionData, sizeData, velocityData } = this;
    const startIdx = config.controlSphere0 ? 1 : 0;
    if (config.controlSphere0) {
      const p0 = new Vector3().fromArray(positionData, 0).lerp(center, 0.1);
      p0.toArray(positionData, 0);
      new Vector3(0, 0, 0).toArray(velocityData, 0);
    }
    for (let i = startIdx; i < config.count; i++) {
      const base = 3 * i;
      const pos = new Vector3().fromArray(positionData, base);
      const vel = new Vector3().fromArray(velocityData, base);
      vel.y -= deltaInfo.delta * config.gravity * sizeData[i];
      vel.multiplyScalar(config.friction);
      vel.clampLength(0, config.maxVelocity);
      pos.add(vel);
      for (let j = i + 1; j < config.count; j++) {
        const otherBase = 3 * j;
        const otherPos = new Vector3().fromArray(positionData, otherBase);
        const diff = new Vector3().subVectors(otherPos, pos);
        const dist = diff.length();
        const sumRadius = sizeData[i] + sizeData[j];
        if (dist < sumRadius) {
          const overlap = (sumRadius - dist) * 0.5;
          diff.normalize();
          pos.addScaledVector(diff, -overlap);
          otherPos.addScaledVector(diff, overlap);
          pos.toArray(positionData, base);
          otherPos.toArray(positionData, otherBase);
        }
      }
      this.#handleBoundaries(pos, vel, sizeData[i], base);
    }
  }

  #handleBoundaries(pos, vel, size, base) {
    const { config, positionData, velocityData } = this;
    if (Math.abs(pos.x) + size > config.maxX) {
      pos.x = Math.sign(pos.x) * (config.maxX - size);
      vel.x *= -config.wallBounce;
    }
    if (pos.y - size < -config.maxY) {
      pos.y = -config.maxY + size;
      vel.y *= -config.wallBounce;
    }
    if (Math.abs(pos.z) + size > config.maxZ) {
      pos.z = Math.sign(pos.z) * (config.maxZ - size);
      vel.z *= -config.wallBounce;
    }
    pos.toArray(positionData, base);
    vel.toArray(velocityData, base);
  }
}
