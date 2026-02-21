import { useRef, useEffect } from 'react';

import Phaser from 'phaser';
import { getOrInitMic } from './util/microphone.js';
import { PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus.js';

let getVol = await getOrInitMic();

function App ()
{
    //song beats
    const beatMap = {
        song: "Golden - Kpop Demon Hunters",
        start: 43,
        end: 67,
        beats: [47.095,47.564,48.084,48.512,48.995,49.495,50.012,50.477,50.991,51.428,51.928,52.395,52.74,53.028,54.4,54.9,55.4,55.867,56.332,56.817,57.315,57.833,58.328,58.844,59.249,59.779,61.634,62.113,62.368,62.61,63.18,63.674,63.957,64.127,64.464,64.662,65.094,65.593,65.763,65.946,66.147,66.309,66.474,66.666,66.929,67.609,67.777,67.945,68.125,68.293,68.662]
    }

    const VOLUME_DETECT_THROTTLE = 100; //ms

    useEffect(() => {
        const interval = setInterval(() => {
            EventBus.emit('volume-detect', getVol());
        return () => {
            clearInterval(interval);
        }
        }, VOLUME_DETECT_THROTTLE)
    })

    const VOL_THRESHOLD = 0.1;

    const canvasRef = useRef();
    const audioRef = useRef(null);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    
    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {}
        
    //check if on beat
    function isOnBeat(audioCurrentTime, beats, window=0.5){
        return beats.some(beat => Math.abs(audioCurrentTime - beat) < window);
    }

    //start game
    let keyListener = null;
    async function startRhythmGame() {
        const hitBeats = new Set();
        const missedBeats = new Set();
        //restart
        if(audioRef.current){
            audioRef.current.pause();
            audioRef.current = null;
        }
        const audio = new Audio("/level1.mp3");
        audioRef.current = audio;
        audio.currentTime = beatMap.start;
        audio.play();


        // hold notes
        const holdBeats = {
            // 47.095: 0.2,
            // 47.564: 0.2,
            // 48.084: 0.2,
            // 48.512: 0.2, 
            // 48.995: 0.2,
            // 49.495: 0.2,
            // 50.012: 0.2,
            // 50.477: 0.2,
            // 50.991:0.2,
            // 51.428: 0.2, 
            // 51.928: 0.2, 
            // 52.395: 0.2,
            // 52.74: 0.2,
            53.028: 0.7,
            // 54.4: 0.2, 
            // 54.9: 0.2, 
            // 55.4: 0.2,
            // 55.867: 0.2, 
            // 56.332: 0.2, 
            // 56.817: 0.2, 
            // 57.315:0.2,
            // 57.833: 0.2,
            // 58.328: 0.2,
            // 58.844:0.2,
            // 59.249:0.2, 
            59.779: 1.5,
            // 61.634: 0.2,
            // 62.61: 0.2,
            // 63.18: 0.2,
            // 63.674:0.2,
            // 64.662: 0.2,
            // 66.666: 0.2,
            // 66.929:0.2,
            68.293:0.1,
            68.662:0.1
            
        }
        const holdProgress = {};

        //stop playing after last beat
        const lastBeat = beatMap.beats[beatMap.beats.length-1];
        setTimeout(() => {
            audio.pause();
        }, (lastBeat - beatMap.start + 2)*1000);


        //missed rects
        let lastCheckedBeat =0;
        setInterval(() => {
            const t=audio.currentTime;
            const missedBeat = beatMap.beats.find(
                beat => beat > lastCheckedBeat && beat < t - 0.5 && !hitBeats.has(beat)
            );
            if(missedBeat){
                missedBeats.add(missedBeat);
                lastCheckedBeat = missedBeat;
            }
        }, 1);

        ///canvas constants (for the scrolling rhythm rects)
        const canvas = canvasRef.current;
        canvas.width  = window.innerWidth; 
        const ctx = canvas.getContext("2d");
        const PIXELS_PER_SEC = 400;
        const gameStartTime = Date.now();

        //draw rhythm rects
        function drawBeats() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const elapsed = (Date.now() - gameStartTime) / 1000;
            const t = audio.currentTime;
            
            //countdown
            if(elapsed<3) {
                const count = elapsed<1 ? "3" : elapsed<2 ? "2" : "1";
                ctx.fillStyle = "#fff";
                ctx.font = "bold 48px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(count, canvas.width/2, 55);
            } else if(elapsed<3.8){
                ctx.fillStyle = "#fff";
                ctx.font = "bold 36px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("START!", canvas.width/2, 55);
            } else if(audio.paused && elapsed>3){
                ctx.fillStyle = "#fff";
                ctx.font = "bold 48px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`GOOD JOB! ${hitBeats.size} / ${beatMap.beats.length} hits`, canvas.width/2, 55);

                return;
            } else{
                beatMap.beats.forEach(beat => {
                    const x = canvas.width/2 + (beat-t) * PIXELS_PER_SEC;
                    if(x < -20 || x > canvas.width + 20) return;
                    
                    const holdDuration = holdBeats[beat];
                    const width = holdDuration?holdDuration*PIXELS_PER_SEC : 20;

                    if(hitBeats.has(beat)) ctx.fillStyle = "#0f0";
                    else if(missedBeats.has(beat)) ctx.fillStyle = "#f00";
                    else ctx.fillStyle = "#fff";
                    ctx.fillRect(x-10, 10, width, 60);
                });
                ctx.strokeStyle="white";
                ctx.lineWidth=2;
                ctx.beginPath();
                ctx.moveTo(canvas.width/2, 0);
                ctx.lineTo(canvas.width/2, 80);
                ctx.stroke();
            }

            requestAnimationFrame(drawBeats);
        }
        drawBeats();

        function loop() {
            if(audio.currentTime < beatMap.end) {
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);

        // if(keyListener){
        //     document.removeEventListener("keydown", keyListener);
        // }
        // keyListener = function(e) {
        //     if(e.code === "KeyS") {
        //         const onBeat = isOnBeat(audio.currentTime, beatMap.beats, 0.2);
        //         console.log(onBeat ? "HIT!" : "MISS!", "t=", audio.currentTime.toFixed(2));
        //         if(onBeat){
        //             const hitBeat = beatMap.beats.find(beat => Math.abs(audio.currentTime - beat) < 0.2);
        //             hitBeats.add(hitBeat);
        //         } else if(t>= beatMap.start && t<= beatMap.end){
        //             missedBeats.add(t);
        //         }
        //     }
        // };
        // document.addEventListener("keydown", keyListener);

        let lastTriggerTime = 0;
        
        function micLoop(volume){
            const now=Date.now();
            const t= audio.currentTime;
            // console.log(volume)
            if(volume>VOL_THRESHOLD) {
                for(const [beatStr, duration] of Object.entries(holdBeats)){
                    const beat = parseFloat(beatStr);
                    if(Math.abs(t-beat) < duration && !hitBeats.has(beat)){
                        holdProgress[beat] = (holdProgress[beat] || 0) + (1/60);
                        if(holdProgress[beat] >= duration){
                            hitBeats.add(beat);
                            console.log(`HOLD HIT! beat=${beat}, duration=${duration}s`);
                        }
                    }
                }

                if(now-lastTriggerTime>200){
                    lastTriggerTime=now;
                    const onBeat=isOnBeat(audio.currentTime, beatMap.beats, 0.5);
                    const isHoldBeat = Object.keys(holdBeats).some(b => Math.abs(t - parseFloat(b)) < 0.5);
                    if(onBeat && !isHoldBeat){
                        const hitBeat = beatMap.beats.find(beat => Math.abs(audio.currentTime - beat) < 0.5);
                        hitBeats.add(hitBeat);
                        console.log(onBeat ? "HIT!" : "MISS!", "t=", audio.currentTime.toFixed(2));
                    }
                }
            } else {
                for(const beat of Object.keys(holdBeats)){
                    holdProgress[beat] = 0;
                }
            }
        }
        EventBus.on('volume-detect', micLoop)
    }

    return (
        <div id="app">
            <PhaserGame className="phaserGame" ref={phaserRef} currentActiveScene={currentScene} />
            <canvas ref={canvasRef} style={{zIndex: 1, position: 'fixed', bottom:0, left:0, width:'100%', height:'80px', background:'rgba(255, 255, 255, 0.3)'}}/>
            <button onClick={startRhythmGame}></button>
        </div>
    )
}

export default App