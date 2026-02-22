import { EventBus } from '../EventBus.js';
import { Scene } from 'phaser';
import Campfire from '../gameobjects/campfire/Campfire.js';
import Monster from '../gameobjects/monster/Monster.js';
import { toLevelKey } from '../../util/format.js';
import { levels } from '../../levels.js';

export const Phases = Object.freeze({
    CUTE: 'cute',
    EERIE: 'eerie',
    CREEPY: 'creepy'
});

export class Level extends Scene
{    
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
        this.add.image(this.scale.width / 2, this.scale.height / 2, this.phase !== Phases.CREEPY ? 'background-no-fire' : 'creepy-bg');
        
        this.campfire = new Campfire(
            this, 
            this.scale.width / 2, 
            this.scale.height / 2, 
            0.7, 
            this.fireAssetKey, 
            this.phase === Phases.CREEPY ? null : this.fireAnimKey, 
            this.logsKey,
            this.levelData.maxMissed
        );

        this.add.existing(this.campfire)

        this.monsters = this.add.group({ runChildUpdate: true });

        EventBus.emit('bg-music-pause');
        EventBus.on('game-over', this.handleGameOver, this);
        EventBus.on('glitch-effect', this.runGlitchEffect, this);
        this.events.once('shutdown', () => EventBus.off('glitch-effect', this.runGlitchEffect, this));
        EventBus.emit('current-scene-ready', this);
        EventBus.emit('start-rhythm-game', this.levelData, this);

        this.glitchGraphics = this.add.graphics().setDepth(9999);
    }

    runGlitchEffect() {
        if (this.phase !== Phases.EERIE && this.phase !== Phases.CREEPY) return;
        const w = this.scale.width;
        const h = this.scale.height;
        this.cameras.main.shake(200, 0.015);
        this.glitchGraphics.clear();
        this.glitchGraphics.lineStyle(0, 0x000000, 0);
        for (let i = 0; i < 2500; i++) {
            const x = Phaser.Math.Between(0, w);
            const y = Phaser.Math.Between(0, h);
            const s = Phaser.Math.Between(1, 3);
            const g = Phaser.Math.Between(0, 255);
            this.glitchGraphics.fillStyle((g << 16) | (g << 8) | g, 0.9);
            this.glitchGraphics.fillRect(x, y, s, s);
        }
        this.glitchGraphics.setAlpha(0.5);
        this.tweens.add({ targets: this.glitchGraphics, alpha: 0, duration: 180, ease: 'Power2' });
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
            this.phase === Phases.CREEPY ? null : this.monsterAnimKey,
            beat,
            duration,
            appearOffset,
            startAudioTime,
            getCurrentAudioTime,
            scaleInitial,
            scaleFinal
        )
        this.monsters.add(monster, true);
        monster.depth = 100;
        return monster;
    }

    handleGameOver() {
        EventBus.off('game-over', this.handleGameOver, this);
        this.gameOver();
    }

    gameOver()
    {
        this.scene.start('GameOver');
    }

    win()
    {
        this.campfire.onWin();
        if (this.phase == Phases.CUTE) {
            this.scene.start('PhaseTransition', { videoKey: 'afterCute', nextScene: 'SelectLevel' + Phases.EERIE.toUpperCase() });
        } else if (this.phase == Phases.EERIE) {
            const creepyLevel = Object.values(levels).find(l => l.phase === Phases.CREEPY || l.phase === 'creepy');
            const nextScene = creepyLevel ? toLevelKey(creepyLevel.song) : 'GameEnd';
            this.scene.start('PhaseTransition', { videoKey: 'afterEerie', nextScene });
        } else {
            this.scene.start('GameEnd');
        }
    }
}
