import { toLevelKey } from '../../../util/format.js';
import { Level, Phase } from '../Level.js'

export class CreepyLevel extends Level {
  songData;

  constructor(songData) {
    super(Phase.CREEPY, toLevelKey(songData['song']));
    this.songData = songData;
  }
}