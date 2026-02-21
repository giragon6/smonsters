export default class Monster extends Phaser.GameObjects.Sprite {
  assetKey;
  scene;
  dx = 0;
  dy = 0;
  dscale = 0;
  damage;

  // provided by gamescene to run when monster gets close enough to attack
  onAttack;

  constructor(scene, x, y, assetKey, perfectTime, onAttack, damage) {
    super(scene, x, y, assetKey);
    this.assetKey = assetKey;
    this.scene = scene;
    this.damage = damage;

    this.scene.add.existing(this);
  }

  update(time, delta) {
    this.x += this.dx * delta;
    this.y += this.dy * delta;
    this.scale += this.dscale * delta;
  }
}