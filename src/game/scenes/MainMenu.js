import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Phases } from './Level.js';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    checkVol(volume) {
        this.scene.start('BeginStory');
        EventBus.off('volume-detect', null, this);
    }

    create ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        
        this.logo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'logo').setDepth(100);
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'SCREAM TO START', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);


        EventBus.on('volume-detect', (v) => this.checkVol(v));
        
        EventBus.emit('current-scene-ready', this);
    }


}
