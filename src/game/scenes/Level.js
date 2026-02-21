import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';
import Campfire from '../gameobjects/campfire/Campfire.js'

export class Level extends Scene
{
    health = 100;
    campfire;

    constructor ()
    {
        super('Level');
    }

    create ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background-no-fire');
        this.campfire = new Campfire(
            this, 
            this.scale.width / 2, 
            this.scale.height / 2, 
            0.7, 
            'cute-campfire', 
            'cute-campfire-crackle', 
            100
        );
        this.add.existing(this.campfire)

        this.monsters = this.add.group({ runChildUpdate: true });

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
