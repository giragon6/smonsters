import { toLevelKey } from '../../../util/format.js';
import { Level, Phase } from '../Level.js'

export class EerieLevel extends Level {
  songData;

  constructor(songData) {
    super(Phase.EERIE, toLevelKey(songData['song']));
    this.songData = songData;
  }
}