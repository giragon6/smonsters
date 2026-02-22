import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { Phases } from './Level.js';

export class BeginStory extends Scene
{
    constructor ()
    {
        super('BeginStory');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);

        // Title image (loaded in Boot). If missing, you get a black screen - add assets/title.jpg to fix.
        if (this.textures.exists('title')) {
            this.add.image(this.scale.width/2, this.scale.height/2, 'title').setDisplaySize(this.scale.width, this.scale.height);
        }

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 400, 'SCREAM TO CONTINUE', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('bg-music-play');
        EventBus.on('volume-detect', (v) => this.checkVol(v));
        EventBus.emit('current-scene-ready', this);
    }

    checkVol(volume) {
        if (volume > 0.05) {
            EventBus.off('volume-detect', null, this);
            this.scene.start('Preloader');
        }
    }
}
