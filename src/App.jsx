import { useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './PhaserGame';

function App ()
{
    //song beats
    const beatMap = {
        song: "Golden - Kpop Demon Hunters",
        start: 10,
        end: 97,
        beats: [15.977,16.445,16.867,17.327,17.827,18.579,19.434,19.659,20.478,21.395,21.564,21.782,22.062,22.678,23.078,23.397,24.141,24.312,24.5,24.677,25.111,25.278,25.449,25.662,26.378,27.228,27.396,27.58,28.294,29.047,29.24,29.532,29.901,30.076,30.328,30.659,30.835,31.166,31.428,31.813,32.267,32.808,32.994,33.211,33.7,34.195,34.762,35.375,35.695,36.05,36.346,36.698,36.995,37.242,37.581,38.744,38.911,39.146,39.551,40.028,40.566,40.76,41.012,41.508,42.064,42.267,42.815,43.244,43.545,43.862,44.167,44.441,44.757,45.095,45.411,46.126,46.591,47.095,47.564,48.084,48.512,48.995,49.495,50.012,50.477,50.991,51.428,51.928,52.395,52.74,53.028,53.857,54.562,54.946,55.378,55.867,56.332,56.817,57.315,57.833,58.328,58.844,59.249,59.779,61.934,62.113,62.368,62.61,63.18,63.674,63.957,64.127,64.464,64.662,65.094,65.593,65.763,65.946,66.147,66.309,66.474,66.666,66.929,67.609,67.777,67.945,68.125,68.293,68.462,68.662,68.908,69.527,69.963,70.313,70.528,70.992,71.524,71.777,71.978,72.246,72.439,72.828,73.429,73.599,73.773,73.96,74.13,74.311,74.682,75.346,75.513,75.696,75.882,76.047,76.246,76.445,76.71,77.364,77.744,78.107,78.347,78.808,79.295,79.815,80.262,80.728,81.261,81.74,82.225,82.678,83.205,83.396,83.732,83.914,84.264,85.568,86.083,86.577,87.106,87.591,88.061,88.544,89.078,89.543,90.06,90.495,91.059,91.218,91.561,91.79]
    }
    const canvasRef = useRef();
    const audioRef = useRef(null);

    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            scene.changeScene();
        }
    }

    const moveSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene && scene.scene.key === 'MainMenu')
        {
            // Get the update logo position
            scene.moveLogo(({ x, y }) => {

                setSpritePosition({ x, y });

            });
        }
    }

    const addSprite = () => {

        const scene = phaserRef.current.scene;

        if (scene)
        {
            // Add more stars
            const x = Phaser.Math.Between(64, scene.scale.width - 64);
            const y = Phaser.Math.Between(64, scene.scale.height - 64);

            //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
            const star = scene.add.sprite(x, y, 'star');

            //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
            //  You could, of course, do this from within the Phaser Scene code, but this is just an example
            //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
            scene.add.tween({
                targets: star,
                duration: 500 + Math.random() * 1000,
                alpha: 0,
                yoyo: true,
                repeat: -1
            });
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {

        setCanMoveSprite(scene.scene.key !== 'MainMenu');
        
    }

    // record mic (use later)
    async function initMic() {
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
        return getVolume;
    }
        
    //check if on beat
    function isOnBeat(audioCurrentTime, beats, window=0.15){
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
                beat => beat > lastCheckedBeat && beat < t - 0.2 && !hitBeats.has(beat)
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
        const PIXELS_PER_SEC = 200;
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
                ctx.fillText("GOOD JOB!", canvas.width/2, 55);
                return;
            } else{
                beatMap.beats.forEach(beat => {
                    const x = canvas.width/2 + (beat-t) * PIXELS_PER_SEC;
                    if(x < -20 || x > canvas.width + 20) return;
                    
                    if(hitBeats.has(beat)) ctx.fillStyle = "#0f0";
                    else if(missedBeats.has(beat)) ctx.fillStyle = "#f00";
                    else ctx.fillStyle = "#fff";
                    ctx.fillRect(x-10, 10, 20, 60);
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

        if(keyListener){
            document.removeEventListener("keydown", keyListener);
        }
        keyListener = function(e) {
            if(e.code === "KeyS") {
                const onBeat = isOnBeat(audio.currentTime, beatMap.beats, 0.2);
                console.log(onBeat ? "HIT!" : "MISS!", "t=", audio.currentTime.toFixed(2));
                if(onBeat){
                    const hitBeat = beatMap.beats.find(beat => Math.abs(audio.currentTime - beat) < 0.2);
                    hitBeats.add(hitBeat);
                } else if(t>= beatMap.start && t<= beatMap.end){
                    missedBeats.add(t);
                }
            }
        };
        document.addEventListener("keydown", keyListener);
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
                <div>
                    <button disabled={canMoveSprite} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div>
                <div>
                    <button className="button" onClick={startRhythmGame}>Start Rhythm Game</button>
                </div>
            </div>
            <canvas ref={canvasRef} style={{position: 'fixed', bottom:0, left:0, width:'100%', height:'80px', background:'#111'}}/>
        </div>
)
}

export default App