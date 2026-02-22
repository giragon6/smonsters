import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Phases } from './Level';

export class GameOver extends Scene
{    
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);
        EventBus.emit('bg-music-play');

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background-no-fire').setAlpha(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2, 'You lost. \n Your campfire went out, so monsters attacked you.', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
}

