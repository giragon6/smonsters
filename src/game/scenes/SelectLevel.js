import { levels } from '../../levels.js'
import { Scene } from 'phaser';
import { toLevelKey } from '../../util/format.js';
import { EventBus } from '../EventBus.js';

export class SelectLevel extends Scene {
  phase;
  phaseLevelData;
  curVol;
  levelLabelMap = {};
  selected;
  timeout = Date.now();
  throttle = 2000;
  idx = 0;
  hasFinishedSelection = false; //idek bro

  VOL_THRESHOLD = 0.05;

  constructor(key)
  {
    super(key);
  }

  create()
  {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
    this.phaseLevelData = Object.values(levels).filter((level) => level['phase'].toLowerCase() == this.phase.toLowerCase());
    const levelLabels = this.add.group();
    this.phaseLevelData.forEach(level => {
      const levelLabel = this.add.text(this.scale.width / 2, this.scale.height / 2, level['song'], { fontSize: 64 });
      this.levelLabelMap[level['song']] = levelLabel;
      levelLabels.add(levelLabel);
    });
    this.selected = this.phaseLevelData[0];
    Phaser.Actions.GridAlign(
      levelLabels.getChildren(),
      {
        height: -1,
        cellHeight: 72,
        position: Phaser.Display.Align.CENTER,
        x: this.scale.width / 2 - 100, 
        y: 300
      }
    )   
    this.curVol = null;
    EventBus.on('volume-detect', (v) => this.manualVoiceSelect(v));
  }

  manualVoiceSelect(volume) {
    this.curVol = volume;
    if (this.curVol > this.VOL_THRESHOLD && !this.hasFinishedSelection) {
      this.hasFinishedSelection = true;
      EventBus.off('volume-detect', null, this);
      this.scene.start(toLevelKey(this.selected['song']));
    }
    if (Date.now() - this.timeout < this.throttle) {
      return;
    }
    this.levelLabelMap[this.selected['song']].scale = 1;
    this.idx++;
    if (this.idx > this.phaseLevelData.length - 1) {
      this.idx = 0;
    }
    this.selected = this.phaseLevelData[this.idx];
    this.levelLabelMap[this.selected['song']].scale = 1.5;
    this.timeout = Date.now();
  }
}