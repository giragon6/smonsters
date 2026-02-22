import { Scene } from 'phaser';
import { EventBus } from '../EventBus.js';

export class PhaseTransition extends Scene {
    constructor() {
        super('PhaseTransition');
    }

    init(data) {
        this.videoKey = data.videoKey || null;
        this.nextScene = data.nextScene || 'MainMenu';
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);
        if (this.videoKey === 'afterEerie') {
            EventBus.emit('bg-music-pause');
        } else {
            EventBus.emit('bg-music-play');
        }

        const goToNext = () => this.scene.start(this.nextScene);

        if (this.videoKey && this.cache.video.exists(this.videoKey)) {
            const video = this.add.video(this.scale.width / 2, this.scale.height / 2, this.videoKey);
            video.on('created', () => {
                video.setScale(Math.min(this.scale.width / video.width, this.scale.height / video.height));
            });
            video.on('complete', goToNext);
            video.on('error', goToNext);
            video.play();
        } else {
            goToNext();
        }
    }
}
