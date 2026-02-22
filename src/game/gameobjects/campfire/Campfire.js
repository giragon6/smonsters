import { EventBus } from '../../EventBus.js';

export default class Campfire extends Phaser.GameObjects.Sprite {
  health;
  maxHealth;
  assetKey;
  animKey;
  logsKey;
  missed;

  onMissedUpdate(missed) {
    this.missed = Number(missed);
    if (this.health <= 0) {
      EventBus.off('missed-beats', null, this);
      this.destroy();
    } else {
      this.alpha = (this.maxMissed - this.missed) / this.maxMissed;
    }
  }

  onWin() {
    EventBus.off('missed-beats', null, this);
    this.destroy();
  }

  constructor(scene, x, y, scale, assetKey, animKey, logsKey, maxMissed) {
    super(scene, x, y, assetKey, 0);
    this.scale = scale;
    this.animKey = animKey;
    this.logsKey = logsKey;
    this.maxMissed = Number(maxMissed);
    console.log(maxMissed)

    EventBus.on('missed-beats', (missed) => this.onMissedUpdate(missed));
    if (this.animKey) this.play(this.animKey);
    let logs = scene.add.sprite(x, y, this.logsKey);
    logs.scale = this.scale;
  }
}