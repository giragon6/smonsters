import { toLevelKey } from '../../../util/format.js';
import { Level, Phase } from '../Level.js'

export class CuteLevel extends Level {
  songData;

  constructor(songData) {
    super(Phase.CUTE, toLevelKey(songData['song']));
    this.songData = songData;
  }
}