const audio = new Audio("/badguy.mp3");
const beats = [];
audio.currentTime = 48;
audio.play();

document.addEventListener("keydown", function(e) {
    if(e.code === "Space") {
        const t= parseFloat(audio.currentTime.toFixed(3));
        beats.push(t);
        console.log("Beat:", t, "| all:", JSON.stringify(beats));
    }
})