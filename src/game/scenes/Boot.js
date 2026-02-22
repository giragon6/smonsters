import { Scene } from 'phaser';

const TESTING_SKIP_TO_LEVEL = null;

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('background', 'assets/bg.png');
        this.load.image('background-no-fire', 'assets/bg-no-fire.png');
        this.load.image('title', 'assets/title.jpg');
        this.load.image('title2', 'assets/title2.jpg');
    }

    create ()
    {
        if (TESTING_SKIP_TO_LEVEL) {
            this.scene.start('Preloader', { skipToLevel: TESTING_SKIP_TO_LEVEL });
        } else {
            this.scene.start('BeginStory');
        }
    }
}
