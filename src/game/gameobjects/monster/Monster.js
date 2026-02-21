import { EventBus } from '../../EventBus.js';

export default class Monster extends Phaser.GameObjects.Sprite {
  static tolerance = 0.1;
  
  animKey;
  scene;
  dscale = 0;
  beat;
  duration;
  startAudioTime;
  getCurrentAudioTime;
  damage;
  scaleInitial;
  scaleFinal;

  constructor(
    scene, 
    x, 
    y, 
    assetKey,
    animKey, 
    beat, 
    duration,
    appearOffset,
    startAudioTime, 
    getCurrentAudioTime,
    damage = 10,
    scaleInitial = 0.25,
    scaleFinal = 0.5
  ) {
    super(scene, x, y, assetKey, 0);
    this.animKey = animKey;
    this.scene = scene;
    this.beat = Number(beat);
    this.duration = Number(duration);
    this.appearOffset = Number(appearOffset);
    this.startAudioTime = Number(startAudioTime);
    this.getCurrentAudioTime = getCurrentAudioTime;
    this.damage = damage;
    this.scaleInitial = Number(scaleInitial);
    this.scaleFinal = Number(scaleFinal);

    this.play(this.animKey);
    this.setVisible(false);

    this.scale = this.scaleInitial;
    this.dscale = (this.scaleFinal - this.scaleInitial)/((Number(this.duration) + Number(this.appearOffset)) * 1000);

    this.scene.add.existing(this);
  }

  update(time, delta) {
    if (this.visible) {
      this.scale += this.dscale * delta; // todo: do with tweens
      if (this.getCurrentAudioTime() > (this.beat + this.duration + Monster.tolerance)) {
        //attack
        this.destroy()
        EventBus.emit('damage-taken', this.damage);
      }
    } else if (this.getCurrentAudioTime() > (this.beat - this.appearOffset)) {
      this.setVisible(true);
    }
  }

  onGameEnd() {
    this.destroy();
  }

  onHit() {
    this.destroy()
  }
}