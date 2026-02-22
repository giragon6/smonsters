const audio = new Audio("/beautyandabeat.mp3");
const beats = [];
audio.currentTime = 134;
audio.play();

document.addEventListener("keydown", function(e) {
    if(e.code === "Space") {
        const t= parseFloat(audio.currentTime.toFixed(3));
        beats.push(t);
        console.log("Beat:", t, "| all:", JSON.stringify(beats));
    }
})