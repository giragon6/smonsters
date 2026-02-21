import { levels } from '../../levels.js'
import { Scene } from 'phaser';

export class SelectLevel extends Scene {
  phase;

  constructor(key)
  {
    super(key);
  }

  create()
  {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
    const phaseLevelData = Object.values(levels).filter((level) => level['phase'].toLowerCase() == this.phase.toLowerCase());
    const levelLabels = this.add.group();
    phaseLevelData.forEach(level => {
      const levelLabel = this.add.text(this.scale.width / 2, this.scale.height / 2, level['song'], { fontSize: 64 });
      levelLabels.add(levelLabel);
    });
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
  }

  handleRecognition()
  {
  }
}