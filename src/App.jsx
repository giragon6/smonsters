import { useRef, useState, useEffect } from 'react';
import { levels } from './levels.js';
import Phaser from 'phaser';
import { getOrInitMic } from './util/microphone.js';
import { PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus.js';
import Monster from './game/gameobjects/monster/Monster.js'

let getVol = await getOrInitMic();

function App ()
{
    //set up level / song
    const levelData = levels.golden;
    const lyricsRef = useRef();
    const canvasRef = useRef();
    const audioRef = useRef(null);
    const healthRef = useRef(null);

    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    
    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        setCanMoveSprite(scene.scene.key !== 'MainMenu');
        
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
    const DEFAULT_DURATION = 0.5;
        
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
            if(lyricsRef.current) lyricsRef.current.textContent = "";
            if(healthRef.current) healthRef.current.style.width = "100%";
        }
        const audio = new Audio(levelData.audio);
        audioRef.current = audio;
        audio.currentTime = levelData.start;
        audio.play();

        //health
        let health = 100;
        const lossPerMiss = 100 / (levelData.beats.length - 0.75*levelData.beats.length); // only count non-hold beats for health loss
        if(healthRef.current) healthRef.current.style.width = "100%";

        // hold notes
        const holdProgress = {};

        const getCurrentAudioTime = () => audio.currentTime;

        function spawnMonsters() {
            const scene = phaserRef.current.scene;
            levelData.beats.forEach(beat => {
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);
                const monster = new Monster(
                    scene, 
                    x, 
                    y, 
                    'monster',
                    'monster-idle', 
                    beat,
                    (levelData.holdBeats[beat] ? levelData.holdBeats[beat] : DEFAULT_DURATION),
                    1.0,
                    audio.currentTime,
                    getCurrentAudioTime
                );
                scene.monsters.add(monster);
            })
            }

        spawnMonsters()
        

        //stop playing after last beat
        const lastBeat = levelData.beats[levelData.beats.length-1];
        setTimeout(() => {
            audio.pause();
        }, (lastBeat - levelData.start + 2)*1000);

        function gameOver() {
            audio.pause();
            if(lyricsRef.current) lyricsRef.current.textContent = "GAME OVER!";
            phaserRef.current.scene.monsters.clear();
        }

        //missed rects
        let lastCheckedBeat =0;
        setInterval(() => {
            const t=audio.currentTime;
            const missedBeat = levelData.beats.find(
                beat => beat > lastCheckedBeat && beat < t - 0.5 && !hitBeats.has(beat)
            );
            if(missedBeat){
                missedBeats.add(missedBeat);
                lastCheckedBeat = missedBeat;
                health=Math.max(0, health-lossPerMiss);
                if(healthRef.current) healthRef.current.style.width = health+'%';
                if(health<=0){
                    gameOver();
                }
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
                ctx.fillText(`${hitBeats.size} / ${hitBeats.size + missedBeats.size} hits`, canvas.width/2, 55);
                if(health>0 && lyricsRef.current) lyricsRef.current.textContent = "YOU WIN!";
                return;
            } else{
                levelData.beats.forEach(beat => {
                    const x = canvas.width/2 + (beat-t) * PIXELS_PER_SEC;
                    if(x < -20 || x > canvas.width + 20) return;
                    
                    const holdDuration = levelData.holdBeats[beat];
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

                // update lyrics
                const lyric = levelData.lyrics.filter(l => l.t <= t).pop();
                if(lyricsRef.current) {
                    lyricsRef.current.textContent = lyric ? lyric.text : "";
                }
            }

            requestAnimationFrame(drawBeats);
        }
        drawBeats();

        function loop() {
            if(audio.currentTime < levelData.end) {
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);
        const getVolume = await getOrInitMic();
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
                    const onBeat=isOnBeat(audio.currentTime, levelData.beats, 0.5);
                    const isHoldBeat = Object.keys(levelData.holdBeats).some(b => Math.abs(t - parseFloat(b)) < 0.5);
                    if(onBeat && !isHoldBeat){
                        const hitBeat = levelData.beats.find(beat => Math.abs(audio.currentTime - beat) < 0.5);
                        hitBeats.add(hitBeat);
                        console.log(onBeat ? "HIT!" : "MISS!", "t=", audio.currentTime.toFixed(2));
                    }
                }
            } else {
                for(const beat of Object.keys(levelData.holdBeats)){
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
            <div ref={lyricsRef} style={{position: 'fixed', bottom:80, left:0, width:'100%', background:'#111', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 32, fontWeight: 'bold', padding: '8px 0'}}/>
            <canvas ref={canvasRef} style={{position: 'fixed', bottom:0, left:0, width:'100%', height:'80px', background:'#111'}}/>
            <div style={{position:'fixed', top:16, right:16, width:200, zIndex:999}}>
                <div style={{fontSize:12, color:'white', marginBottom:4, textAlign:'right'}}>HEALTH</div>
                <div style={{background: '#ff0000', borderRadius:4, height:16, width:'100%'}}>
                    <div ref={healthRef} style={{height:'100%', width:'100%', background: '#2ecc71', borderRadius:4, transition: 'width 0.2s'}}/>
                </div>
            </div>
            <button onClick={startRhythmGame}></button>
        </div>
    )
}

export default App