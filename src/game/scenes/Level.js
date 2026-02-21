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
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);
        this.startTime = null;

        
        this.monsters = this.add.group({ key: 'monster' });
        const monster = new Monster(this, 512, 384, 'star', 10000, this.onMonsterAttack, 10);
        this.monsters.add(monster);

        EventBus.emit('current-scene-ready', this);
    }

    startTimer()
    {
        this.startTime = this.time.now;
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }

    update(time, delta)
    {
        if (this.startTime === null) this.startTimer();
        this.monsters.getChildren().forEach(m => m.update(this.time.now - this.startTime, delta));
    }

    decreaseHealth(number)
    {
        // do something with the campfire
    }

    onMonsterAttack(monster)
    {
        monster.destroy();
        this.decreaseHealth(monster.damage);
    }
}
