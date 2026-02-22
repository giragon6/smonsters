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

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const displayW = this.scale.width;
        const displayH = this.scale.height;

        if (this.textures.exists('title')) {
            this.titleImg1 = this.add.image(cx, cy, 'title').setDisplaySize(displayW, displayH).setDepth(0);
        }
        if (this.textures.exists('title2')) {
            this.titleImg2 = this.add.image(cx, cy, 'title2').setDisplaySize(displayW, displayH).setDepth(0).setAlpha(0);
        }
        if (this.titleImg1 && this.titleImg2) {
            this.time.addEvent({ delay: 450, callback: this.toggleTitleFrame, callbackScope: this, loop: true });
        } else if (this.titleImg1) {
            this.titleImg1.setAlpha(1);
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

    toggleTitleFrame() {
        if (!this.titleImg1 || !this.titleImg2) return;
        const a1 = this.titleImg1.alpha;
        this.titleImg1.setAlpha(1 - a1);
        this.titleImg2.setAlpha(a1);
    }

    checkVol(volume) {
        if (volume > 0.05) {
            EventBus.off('volume-detect', null, this);
            this.scene.start('Preloader');
        }
    }
}
