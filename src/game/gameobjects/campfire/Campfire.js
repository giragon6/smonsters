import { EventBus } from '../../EventBus.js';

export default class Campfire extends Phaser.GameObjects.Sprite {
  health;
  maxHealth;

  onDamage(damage) {
    this.health -= Number(damage);
    if (this.health <= 0) {
      EventBus.emit('game-over');
      this.destroy();
    }
    this.alpha = this.health / this.maxHealth;
  }

  constructor(scene, x, y, scale, assetKey, animKey, logsKey, health=100) {
    super(scene, x, y, assetKey, 0);
    this.scale = scale;
    this.play(animKey);
    this.health = health;
    this.maxHealth = health;
    const logs = scene.add.sprite(x, y, logsKey);
    logs.scale = scale;

    EventBus.on('damage-taken', (damage) => this.onDamage(damage));
  }

}