import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';
import Monster from '../gameobjects/monster/Monster.js'

export class Level extends Scene
{
    health = 100;

    constructor ()
    {
        super('Level');
    }

    create ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background-no-fire');

        this.monsters = this.add.group({ runChildUpdate: true });
        // const monster = new Monster(this, 512, 384, 'star', 10000, this.onMonsterAttack, 10);
        // this.monsters.add(monster);

        EventBus.emit('current-scene-ready', this);
    }

    gameOver()
    {
        this.scene.start('GameOver');
    }

    update(time, delta)
    {
    }
}
