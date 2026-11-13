/**
 * Camera rig (docs/08 Camera rig): one perspective camera for every view.
 * 2D = very narrow field of view far away (looks orthographic); iso = 2D + yaw 45° / pitch 35.26°;
 * 3D = normal field of view. Transitions interpolate the pose while keeping the frame height at the
 * target constant (dolly zoom), so 2D "extrudes" into 3D without a snap.
 */
import * as THREE from 'three';
import type { View } from '@/content/types';

export interface CameraPose {
  fov: number; // degrees
  frameHeight: number; // world units visible vertically at the target
  yaw: number; // degrees, 0 = looking along -Z
  pitch: number; // degrees, positive = looking down
  roll: number; // degrees
  target: THREE.Vector3;
  /** How quickly the camera follows the target each frame (0..1); default 0.12. 1 = locked on. */
  follow?: number;
}

export function presetPose(view: View, frameHeight = 10, target = new THREE.Vector3()): CameraPose {
  switch (view) {
    case '2d':
      return { fov: 1.5, frameHeight, yaw: 0, pitch: 0, roll: 0, target };
    case '2.5d':
      return { fov: 20, frameHeight, yaw: 0, pitch: 8, roll: 0, target };
    case 'iso':
      return { fov: 1.5, frameHeight, yaw: 45, pitch: 35.26, roll: 0, target };
    case '3d':
    case 'split':
    case '4d':
      return { fov: 60, frameHeight, yaw: 0, pitch: 14, roll: 0, target };
    case 'fpv':
      return { fov: 75, frameHeight, yaw: 0, pitch: 4, roll: 0, target };
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function lerpPose(a: CameraPose, b: CameraPose, t: number): CameraPose {
  // Interpolate the field of view in tan-space so the dolly zoom feels linear.
  const ta = Math.tan(THREE.MathUtils.degToRad(a.fov / 2));
  const tb = Math.tan(THREE.MathUtils.degToRad(b.fov / 2));
  const tanHalf = Math.exp(lerp(Math.log(ta), Math.log(tb), t));
  return {
    fov: THREE.MathUtils.radToDeg(2 * Math.atan(tanHalf)),
    frameHeight: lerp(a.frameHeight, b.frameHeight, t),
    yaw: lerp(a.yaw, b.yaw, t),
    pitch: lerp(a.pitch, b.pitch, t),
    roll: lerp(a.roll, b.roll, t),
    target: a.target.clone().lerp(b.target, t),
  };
}

export class CameraRig {
  readonly camera = new THREE.PerspectiveCamera(60, 1, 0.1, 5000);
  pose: CameraPose = presetPose('2d');
  /** extra roll from havocs, degrees */
  extraRoll = 0;
  private from: CameraPose | null = null;
  private to: CameraPose | null = null;
  private t0 = 0;
  private dur = 0;

  /** Start a transition to a pose over durationMs (eased). */
  transition(to: CameraPose, durationMs: number, now: number): void {
    this.from = { ...this.pose, target: this.pose.target.clone() };
    this.to = to;
    this.t0 = now;
    this.dur = durationMs;
  }

  get transitioning(): boolean {
    return this.to !== null;
  }

  /** progress 0..1 of the running transition */
  progress(now: number): number {
    return this.to ? Math.min(1, (now - this.t0) / Math.max(1, this.dur)) : 1;
  }

  /** Follow a target while not transitioning (or retarget the transition's end). */
  follow(target: THREE.Vector3, smooth = 1): void {
    if (this.to) this.to.target.copy(target);
    else this.pose.target.lerp(target, smooth);
  }

  setPose(p: CameraPose): void {
    this.pose = p;
    this.from = this.to = null;
  }

  update(now: number, aspect: number): void {
    if (this.from && this.to) {
      const k = this.progress(now);
      this.pose = lerpPose(this.from, this.to, ease(k));
      if (k >= 1) {
        this.pose = this.to;
        this.from = this.to = null;
      }
    }
    const p = this.pose;
    const cam = this.camera;
    const halfFov = THREE.MathUtils.degToRad(p.fov / 2);
    const distance = p.frameHeight / 2 / Math.tan(halfFov);
    const yaw = THREE.MathUtils.degToRad(p.yaw);
    const pitch = THREE.MathUtils.degToRad(p.pitch);
    const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    cam.position.copy(p.target).addScaledVector(dir, distance);
    cam.up.set(0, 1, 0);
    cam.lookAt(p.target);
    cam.rotateZ(THREE.MathUtils.degToRad(p.roll + this.extraRoll));
    cam.fov = p.fov;
    cam.aspect = aspect;
    // Keep the depth range tight around the scene: in the narrow-FOV 2D/iso poses the camera is
    // hundreds of units away, and a wide near/far range leaves too little depth precision to
    // separate surfaces a few centimetres apart (z-fighting).
    cam.near = Math.max(0.05, distance - p.frameHeight * 6);
    cam.far = distance + Math.max(p.frameHeight * 12, p.fov > 10 ? 250 : 0);
    cam.updateProjectionMatrix();
  }
}
