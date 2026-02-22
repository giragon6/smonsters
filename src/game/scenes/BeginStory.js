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

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background-no-fire').setAlpha(0.5);

        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Hello happy camper (or should I say, Vivacious Trekker ;D)! \n We are so excited to go camping with you, welcome! \nBe careful, there are smonsters nearby, sing to the rhythm\n to keep our campfire going!', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 400, 'SCREAM TO CONTINUE', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.on('volume-detect', (v) => this.checkVol(v));
        EventBus.emit('current-scene-ready', this);
    }

    checkVol(volume) {
        if (volume > 0.05) {
            EventBus.off('volume-detect', null, this);
            this.scene.start('SelectLevel' + Phases.CUTE.toUpperCase());
        }
    }
}
