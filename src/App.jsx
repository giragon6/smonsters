import { useRef, useState, useEffect } from 'react';
import { levels } from './levels.js';
import Phaser from 'phaser';
import { getOrInitMic } from './util/microphone.js';
import { PhaserGame } from './PhaserGame';
import { EventBus } from './game/EventBus.js';

const DEBUG = false;

let getVol = await getOrInitMic();

function App ()
{    
    //set up level / song
    const lyricsRef = useRef();
    if (lyricsRef.current) lyricsRef.current.textContent = "";
    const canvasRef = useRef();
    const rhythmGameActiveRef = useRef(false);
    const audioRef = useRef(null);
    let isGameOver = true;
    const healthRef = useRef(null);
    const hauntedRef = useRef(null);
    const flashRef = useRef(null);
    const clawRef = useRef(null);
    const bgMusicRef = useRef(null);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    
    const currentScene = (scene) => {        
    }

    const VOLUME_DETECT_THROTTLE = 100; //ms

// bg music
    useEffect(() => {
        const bg = new Audio("/bg_music.mp3");
        bg.loop = true;
        bgMusicRef.current = bg;
        const onPlay = () => { bg.play().catch(() => {}); };
        const onPause = () => { bg.pause(); };
        EventBus.on('bg-music-play', onPlay);
        EventBus.on('bg-music-pause', onPause);
        return () => {
            EventBus.off('bg-music-play', onPlay);
            EventBus.off('bg-music-pause', onPause);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            EventBus.emit('volume-detect', getVol());
        return () => {
            clearInterval(interval);
        }
        }, VOLUME_DETECT_THROTTLE)
    })

    useEffect(() => {
        EventBus.once('start-rhythm-game', (ld, s) => {
        if (isGameOver) {
            startRhythmGame(ld, s);
        }
        });
    }, [])

    const VOL_THRESHOLD = 0.03;  
    const BEAT_WINDOW = 0.55;     
    const BEAT_RECT_WIDTH = 24; 

    //check if on beat
    function isOnBeat(levelData, audioCurrentTime, beats, window = BEAT_WINDOW){
        return levelData.beats.some(beat => Math.abs(audioCurrentTime - beat) < window);
    }

    //start game
    let keyListener = null;
    let currentMicLoop = null;
    async function startRhythmGame(levelData, scene) {
        rhythmGameActiveRef.current = false;
        isGameOver = false;
        const hitBeats = new Set();
        const missedBeats = new Set();
        //restart
        if(audioRef.current){
            audioRef.current.pause();
            audioRef.current = null;
        }
        if(levelData.phase==="creepy"){
            if(hauntedRef.current){
                hauntedRef.current.pause();
                hauntedRef.current = null;
            }
            const hauntedAudio = new Audio("/haunted.mp3");
            hauntedRef.current = hauntedAudio;
            hauntedAudio.currentTime=50;
            hauntedAudio.play();
            console.log("haunted audio playing")
            setTimeout(() => hauntedAudio.pause(), 30000);
        }
        if(lyricsRef.current) lyricsRef.current.textContent = "";
        rhythmGameActiveRef.current = true;
        const audio = new Audio(levelData.audio);
        audioRef.current = audio;
        audio.currentTime = levelData.start;
        audio.play();

        // hold notes
        const holdProgress = {};

        const getCurrentAudioTime = () => audio.currentTime;

        let beatMonsterMap = {}

        const xoffset = 2048*0.125;
        const yoffset = xoffset;

        function spawnMonsters() {
            console.log(levelData.beats)
            levelData.beats.forEach(beat => {
                const x = Phaser.Math.Between(xoffset, scene.scale.width - xoffset);
                const y = Phaser.Math.Between(yoffset, scene.scale.height - yoffset);
                const monster = scene.addMonster(
                    x, 
                    y, 
                    beat,
                    (levelData.holdBeats[beat] ? levelData.holdBeats[beat] : BEAT_WINDOW),
                    1.0,
                    audio.currentTime,
                    getCurrentAudioTime
                );
                beatMonsterMap[beat] = monster;
            })
            }
        spawnMonsters()
        

        //stop playing after last beat
        const lastBeat = levelData.beats[levelData.beats.length-1];
        setTimeout(() => {
            audio.pause();

        }, (lastBeat - levelData.start+1)*1000);


        EventBus.on('game-over', gameOver);
        function gameOver() {
            rhythmGameActiveRef.current = false;
            if (missedIntervalId != null) clearInterval(missedIntervalId);
            beatMonsterMap = {}
            isGameOver = true;
            audio.pause();
            if(lyricsRef.current) lyricsRef.current.textContent = "GAME OVER!";
            if(canvasRef.current) {
                const ctx2 = canvasRef.current.getContext("2d");
                if(ctx2) ctx2.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            EventBus.once('start-rhythm-game', async (levelData, scene) => await startRhythmGame(levelData, scene));
        }


        //missed rects
        let lastCheckedBeat =0;
        let missedIntervalId = setInterval(() => {
            const t=audio.currentTime;
            const missedBeat = levelData.beats.find(
                beat => beat > lastCheckedBeat && beat < t - BEAT_WINDOW && !hitBeats.has(beat)
            );
            if(missedBeat){
                missedBeats.add(missedBeat);
                const monster = beatMonsterMap[missedBeat];
                EventBus.emit('missed-beats', missedBeats.size);
                if (levelData.phase === 'eerie' || levelData.phase === 'creepy') {
                    EventBus.emit('glitch-effect');
                }
                monster.destroy();
                lastCheckedBeat = missedBeat;
                console.log('Misses:', missedBeats.size, '/', levelData.maxMissed);
                // Health reaches 0 exactly when misses = maxMissed (damage per miss = 100/maxMissed)
                const damage = 100 / levelData.maxMissed;
                EventBus.emit('damage-taken', damage);
                if (missedBeats.size >= levelData.maxMissed) {
                    EventBus.emit('game-over');
                }
                if(flashRef.current) flashRef.current.style.opacity = '0.3';
                if(clawRef.current) clawRef.current.style.opacity = '0.8';
                setTimeout(() => {
                    if(flashRef.current) flashRef.current.style.opacity = '0';
                    if(clawRef.current) clawRef.current.style.opacity='0';
                }, 100);
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
            if (!rhythmGameActiveRef.current) return;
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
            } else if(!isGameOver && audio.paused && elapsed>3){
                ctx.fillStyle = "#fff";
                ctx.font = "bold 48px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${hitBeats.size} / ${hitBeats.size + missedBeats.size} hits`, canvas.width/2, 55);
                if(lyricsRef.current) {
                    rhythmGameActiveRef.current = false;
                    if (missedIntervalId != null) clearInterval(missedIntervalId);
                    if(lyricsRef.current) lyricsRef.current.textContent = "";
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    EventBus.off('volume-detect', currentMicLoop);
                    beatMonsterMap = {};
                    EventBus.once('start-rhythm-game', (ld, s) => startRhythmGame(ld, s));
                    scene.win();
                }
                return;
            } else{
                levelData.beats.forEach(beat => {
                    const x = canvas.width/2 + (beat-t) * PIXELS_PER_SEC;
                    if(x < -20 || x > canvas.width + 20) return;
                    
                    const holdDuration = levelData.holdBeats[beat];
                    const width = holdDuration ? holdDuration * PIXELS_PER_SEC : BEAT_RECT_WIDTH;

                    if(hitBeats.has(beat)) ctx.fillStyle = "#0f0";
                    else if(missedBeats.has(beat)) ctx.fillStyle = "#f00";
                    else ctx.fillStyle = "#fff";
                    ctx.fillRect(x - width / 2, 10, width, 60);
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

            if (rhythmGameActiveRef.current) requestAnimationFrame(drawBeats);
        }
        drawBeats();

        function loop() {
            if(audio.currentTime < levelData.end) {
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);
        let lastTriggerTime = 0;
        

        function addHitBeat(beat) {
            if (hitBeats.has(beat)) return;
            hitBeats.add(beat);
            const monster = beatMonsterMap[beat];
            if (monster) {
                monster.destroy();
                delete beatMonsterMap[beat];
            }
        }

        //debug
        if(currentMicLoop) {
            EventBus.off('volume-detect', currentMicLoop);
            currentMicLoop = null;
        }
        function micLoop(volume){
            const now=Date.now();
            const t= audio.currentTime;
            if(volume>VOL_THRESHOLD) {
                levelData.beats.forEach(beat => {
                    if(hitBeats.has(beat)) return;
                    if(t-beat>-0.1 && t-beat<BEAT_WINDOW){
                        const isHoldBeat=levelData.holdBeats[beat] !== undefined;
                        if(!isHoldBeat){
                            addHitBeat(beat);
                        }
                    }
                });
                
                for(const [beatStr, duration] of Object.entries(levelData.holdBeats)){
                    const beat = parseFloat(beatStr);
                    if(t-beat>-0.1 && t-beat<duration && !hitBeats.has(beat)){
                        holdProgress[beat] = (holdProgress[beat] || 0) + (VOLUME_DETECT_THROTTLE);
                        if(holdProgress[beat] >= duration){
                            addHitBeat(beat);
                            console.log(`HOLD HIT! beat=${beat}, duration=${duration}s`);
                        }
                    }
                }
                
                if(now-lastTriggerTime>100){
                    lastTriggerTime=now;
                    const onBeat=isOnBeat(levelData, audio.currentTime, levelData.beats, BEAT_WINDOW);
                    const isHoldBeat = Object.keys(levelData.holdBeats).some(b => Math.abs(t - parseFloat(b)) < BEAT_WINDOW);
                    if(onBeat && !isHoldBeat){
                        const hitBeat = levelData.beats.find(beat => Math.abs(audio.currentTime - beat) < BEAT_WINDOW);
                        addHitBeat(hitBeat);
                        console.log(onBeat ? "HIT!" : "MISS!", "t=", audio.currentTime.toFixed(2));
                    }
                }
            } else {
                for(const beat of Object.keys(levelData.holdBeats)){
                    holdProgress[beat] = 0;
                }
            }
        }
        currentMicLoop=micLoop;
        EventBus.on('volume-detect', micLoop)
    }

    return (
        <div id="app">
            <PhaserGame className="phaserGame" ref={phaserRef} currentActiveScene={currentScene} />
            <canvas ref={canvasRef} style={{zIndex: 1, position: 'fixed', bottom:0, left:0, width:'100%', height:'80px', background:'rgba(255, 255, 255, 0.3)'}}/>
            <div ref={lyricsRef} style={{position: 'fixed', bottom:80, left:0, width:'100%', background:'#111', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 32, fontWeight: 'bold', padding: '8px 0'}}/>
            <div ref={flashRef} style={{position:'fixed', top:0, left:0, width:'100%', height:'calc(100% - 80px)', background:'red', opacity:0, pointerEvents:'none',zIndex: 998, transition:'opacity 0.3s'}}/>
            <img ref={clawRef} src="/assets/claw.png" style={{position:'fixed', top:0, left:0, width:'100%', height:'calc(100% -150px)', objectFit:'cover', opacity:0,pointerEvents:'none', zIndex:999, transition: 'opacity 0.3s'}}></img>
        </div>
    )
}

export default App