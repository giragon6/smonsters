import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';
import Campfire from '../gameobjects/campfire/Campfire.js';
import Monster from '../gameobjects/monster/Monster.js';
import { toLevelKey } from '../../util/format.js';

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

    levelData;

    fireAssetKey;
    fireAnimKey;
    logsKey;
    monsterAssetKey;
    monsterAnimKey;

    constructor(key, levelData)
    {
        super(key);
        this.phase = levelData['phase'].toLowerCase();
        this.levelData = levelData;
        this.fireAssetKey = this.phase.toLowerCase() + '-campfire';
        this.fireAnimKey = this.phase.toLowerCase() + '-campfire-crackle';
        this.logsKey = this.phase.toLowerCase() + '-logs';
        this.monsterAssetKey = this.phase.toLowerCase() + '-monster';
        this.monsterAnimKey = this.phase.toLowerCase() + '-monster-idle';
    }

    create ()
    {
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'background-no-fire');
        
        console.log(Math.round(this.levelData.beats.length * 0.75) * Monster.damage)

        this.campfire = new Campfire(
            this, 
            this.scale.width / 2, 
            this.scale.height / 2, 
            0.7, 
            this.fireAssetKey, 
            this.fireAnimKey, 
            this.logsKey,
            Math.round(this.levelData.beats.length * 0.75) * Monster.damage //need to get 75% beats
        );

        this.add.existing(this.campfire)

        this.monsters = this.add.group({ runChildUpdate: true });

        EventBus.emit('current-scene-ready', this);
        EventBus.emit('start-rhythm-game', this.levelData, this);
    }

    addMonster(
        x, 
        y, 
        beat, 
        duration,
        appearOffset,
        startAudioTime, 
        getCurrentAudioTime,
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
            Monster.damage,
            scaleInitial,
            scaleFinal
        )
        this.monsters.add(monster, true);
        monster.depth = 100;
        return monster;
    }

    gameOver()
    {
        this.monsters.clear(false, true);
        this.scene.start('GameOver');
    }

    win()
    {
        if (this.phase == Phases.CUTE) {
            this.scene.start('SelectLevel'+Phases.EERIE.toUpperCase())
        } else if (this.phase == Phases.EERIE) {
            this.scene.start('SelectLevel'+Phases.CREEPY.toUpperCase())
        } else {
            //unimplemented
            this.scene.start('GameOver');
        }
    }
}
