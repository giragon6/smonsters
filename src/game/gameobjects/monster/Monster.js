export default class Monster extends Phaser.GameObjects.Sprite {
  assetKey;
  scene;
  dx = 0;
  dy = 0;
  dscale = 0;
  scaleThreshold = 2.0;
  damage;

  // provided by gamescene to run when monster gets close enough to attack
  onAttack;

  constructor(scene, x, y, assetKey, perfectTime, onAttack, damage) {
    super(scene, x, y, assetKey);
    this.assetKey = assetKey;
    this.scene = scene;
    this.perfectTime = perfectTime; //ms
    this.onAttack = onAttack;
    this.damage = damage;

    this.dscale = 1.0 / perfectTime;
    console.log(this.dscale)

    this.scene.add.existing(this);
  }

  update(time, delta) {
    this.x += this.dx * delta;
    this.y += this.dy * delta;
    this.scale += this.dscale * delta;

    if (time >= this.perfectTime) {
      console.log(this.scale)
      this.destroy()
    }
  }
}