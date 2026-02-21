import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';
import Monster from '../gameobjects/monster/Monster.js'

export class Level extends Scene
{
    monsters = [];
    health = 100;
    startTime;

    constructor ()
    {
        super('Level');
    }

    create ()
    {
        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.monsters = this.add.group({ key: 'monster' });
        const monster = new Monster(this, 512, 384, 'star', 10000, this.onMonsterAttack, 10);
        this.monsters.add(monster);

        EventBus.emit('current-scene-ready', this);
    }

    startTimer()
    {
        this.startTime = this.time.now;
    }

    gameOver()
    {
        this.scene.start('GameOver');
    }

    update(time, delta)
    {
        this.monsters.getChildren().forEach(m => m.update(this.time.now - this.startTime, delta));
    }
}
