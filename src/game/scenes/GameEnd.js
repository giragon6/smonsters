import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameEnd extends Scene
{
    constructor ()
    {
        super('GameEnd');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);
        EventBus.emit('bg-music-play');

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'creepy-bg').setAlpha(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Congratulations. You won.', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
}
