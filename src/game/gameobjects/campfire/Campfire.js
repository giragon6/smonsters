import { EventBus } from '../../EventBus.js';

export default class Campfire extends Phaser.GameObjects.Sprite {
  health;
  maxHealth;
  assetKey;
  animKey;
  logsKey;

  onDamage(damage) {
    this.health -= Number(damage);
    if (this.health < 0) this.health = 0;
    this.alpha = this.health / this.maxHealth;
  }

  constructor(scene, x, y, scale, assetKey, animKey, logsKey, health=100) {
    super(scene, x, y, assetKey, 0);
    this.scale = scale;
    this.health = health;
    this.maxHealth = health;
    this.animKey = animKey;
    this.logsKey = logsKey;

    EventBus.on('damage-taken', (damage) => this.onDamage(damage));
    this.play(this.animKey);
    let logs = scene.add.sprite(x, y, this.logsKey);
    logs.scale = this.scale;
  }
}