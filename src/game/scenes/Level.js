import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';
import Campfire from '../gameobjects/campfire/Campfire.js';
import Monster from '../gameobjects/monster/Monster.js';

export const Phases = Object.freeze({
    CUTE: 'cute',
    EERIE: 'eerie',
    CREEPY: 'creepy'
});

export class Level extends Scene
{
    health = 100;
    phase;
    campfire;

    fireAssetKey;
    fireAnimKey;
    logsKey;
    monsterAssetKey;
    monsterAnimKey;

    constructor(key, phase)
    {
        super(key);
        this.phase = phase;
        this.fireAssetKey = this.phase + '-campfire';
        this.fireAnimKey = this.phase + '-campfire-crackle';
        this.logsKey = this.phase + '-logs';
        this.monsterAssetKey = this.phase + '-monster';
        this.monsterAnimKey = this.phase + '-monster-idle';
    }

    create ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background-no-fire');
        
        this.campfire = new Campfire(
            this, 
            this.scale.width / 2, 
            this.scale.height / 2, 
            0.7, 
            this.fireAssetKey, 
            this.fireAnimKey, 
            this.logsKey,
            100
        );

        this.add.existing(this.campfire)

        this.monsters = this.add.group({ runChildUpdate: true });

        EventBus.emit('current-scene-ready', this);
    }

    addMonster(
        x, 
        y, 
        beat, 
        duration,
        appearOffset,
        startAudioTime, 
        getCurrentAudioTime,
        damage = 10,
        scaleInitial = 0.25,
        scaleFinal = 0.5
    ) {
        const monster = new Monster(
            this, 
            x, 
            y, 
            this.monsterAssetKey, 
            this.monsterAnimKey,
            beat,
            duration,
            appearOffset,
            startAudioTime,
            getCurrentAudioTime,
            damage,
            scaleInitial,
            scaleFinal
        )
        this.monsters.add(monster);
        return monster;
    }

    gameOver()
    {
        this.scene.start('GameOver');
    }
}
