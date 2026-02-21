// record mic (use later)
let getVol;

export async function getOrInitMic() {
  if (getVol) { return getVol }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function getVolume() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for(let i = 0; i < dataArray.length; i++){
          const val = (dataArray[i] - 128) / 128;
          sum += val*val;
      }
      return Math.sqrt(sum / dataArray.length);
  }
  getVol = getVolume;
  return getVolume;
}

