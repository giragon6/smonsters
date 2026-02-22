import { Scene } from 'phaser';
import { Phases } from './Level.js';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(this.scale.width / 2 - 230, this.scale.height / 2, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load  assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        this.load.spritesheet('cute-monster', 'cute_monster.png', { frameWidth: 2048, frameHeight: 2048});
        this.load.spritesheet('cute-campfire', 'cute_campfire.png',{ frameWidth: 2048, frameHeight: 2048 } )
        this.load.image('cute-logs', 'cute_logs.png');
        this.load.spritesheet('eerie-monster', 'eerie_monster.png', { frameWidth: 2048, frameHeight: 2048});
        this.load.spritesheet('eerie-campfire', 'eerie_campfire.png',{ frameWidth: 2048, frameHeight: 2048 } )
        this.load.image('eerie-logs', 'eerie_logs.png');
        this.load.image('creepy-campfire', 'creepy_campfire.png');
        this.load.image('creepy-logs', 'creepy_campfire.png');
        this.load.image('creepy-monster', 'creepy_monster.png');
        this.load.image('creepy-bg', 'creepy_bg.png');
        this.load.image('title', 'title.jpg');
        this.load.video('introCutscene', 'introCutscene.mp4');
        this.load.video('afterCute', 'afterCute.mp4');
        this.load.video('afterEerie', 'afterEerie.mp4');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.anims.create({
            key: 'cute-monster-idle',
            frames: this.anims.generateFrameNumbers('cute-monster'),
            frameRate: 6,
            repeat: -1
        })
        
        this.anims.create({
            key: 'cute-campfire-crackle',
            frames: this.anims.generateFrameNumbers('cute-campfire'),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'eerie-monster-idle',
            frames: this.anims.generateFrameNumbers('eerie-monster'),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: 'eerie-campfire-crackle',
            frames: this.anims.generateFrameNumbers('eerie-campfire'),
            frameRate: 6,
            repeat: -1
        })

        const goToCutePhase = () => this.scene.start('SelectLevel' + Phases.CUTE.toUpperCase());
        if (this.cache.video.exists('introCutscene')) {
            const video = this.add.video(this.scale.width / 2, this.scale.height / 2, 'introCutscene');
            video.play();

            video.on('created', () => {
                video.setScale(Math.min(this.scale.width/video.width, this.scale.height/video.height));
            });
            video.on('complete', goToCutePhase);
            video.on('error', goToCutePhase);
            video.play();
        } else {
            goToCutePhase();
        }
    }
}
