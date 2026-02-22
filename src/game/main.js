import { Boot } from './scenes/Boot';
import { Level, Phases } from './scenes/Level';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { GameEnd } from './scenes/GameEnd';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { levels } from '../levels'
import { toLevelKey } from '../util/format';
import { SelectLevel } from './scenes/SelectLevel';
import { BeginStory } from './scenes/BeginStory';
import { PhaseTransition } from './scenes/PhaseTransition';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 2244, 
    height: 1452,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        BeginStory,
        MainMenu,
        PhaseTransition,
        GameOver,
        GameEnd
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    callbacks: {
        preBoot: (game) => {
            const levelsVals = Object.values(levels);
            for (const level of levelsVals) {
                game.scene.add(toLevelKey(level['song']), new Level(toLevelKey(level['song']), level), false)
            }
            const phases = Object.keys(Phases);
            for (const phase of phases) {
                const sl = new SelectLevel('SelectLevel'+phase.toUpperCase());
                sl.phase = phase;
                game.scene.add('SelectLevel'+phase, sl, false);
            }
        }
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
