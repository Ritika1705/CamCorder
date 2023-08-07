let vdo = document.querySelector("video");
let record_btn_cont = document.querySelector(".record_btn_cont");
let capture_btn_cont = document.querySelector(".capture_btn_cont");
let record_btn = document.querySelector(".record_btn");
let capture_btn = document.querySelector(".capture_btn");
let orange = document.querySelector(".orange");
let purple = document.querySelector(".purple");
let normal = document.querySelector(".transparent");
let blue = document.querySelector(".blue");
let filter_layer = document.querySelector(".filter_layer");
let record_flag = false;
let recorder;
let imgCapture;
let chunks = [];

let filterColor;

let constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    vdo.srcObject = stream;
    recorder = new MediaRecorder(stream);

    recorder.onstart= (e) => {
        chunks = [];
        console.log("recording started");
    }
    recorder.ondataavailable = (e) => {
        chunks.push(e.data); 
    }

    recorder.onstop = (e) => {
        //Conversion of media data to video
        console.log(chunks.length);
        let blob = new Blob(chunks , {type : "video/mp4"});
        let videoURL = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    }
})

orange.addEventListener("click", e => {
    filter_layer.style.backgroundColor = "#ffa50030";
})

purple.addEventListener("click", (e) => {
    filter_layer.style.backgroundColor = "#ea59ea2b";
})

blue.addEventListener("click", (e) => {
    filter_layer.style.backgroundColor = "#0019ff33";
})

normal.addEventListener("click", (e) => {
    filter_layer.style.backgroundColor = "";
})


record_btn_cont.addEventListener("click", e =>{

    if(!recorder) return;
     
    record_flag = !record_flag
    if(record_flag){
        recorder.start();
        startTimer();
        record_btn.classList.add("scale_record");
    }
    else
    {
        recorder.stop();
        endTimer();
        record_btn.classList.remove("scale_record");
    } 
})

capture_btn_cont.addEventListener("click", e => {
    var canvas = document.createElement('canvas'); 
    canvas.width = vdo.videoWidth;
    canvas.height = vdo.videoHeight;
    canvas.getContext('2d').drawImage(vdo, 0, 0, vdo.videoWidth, vdo.videoHeight);

    let tool = canvas.getContext('2d');
    tool.fillStyle = filterColor;
    tool.fillRect(0,0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "image.jpg";
    a.click();
})

let timerID;
let counter = 0;

let timer = document.querySelector(".timer");

function startTimer()
{
    timer.style.display = "block";

    function displayTimer()
    {
        counter++;
        let hrs = Number.parseInt(counter/3600);
        let mins_dum = counter%3600;
        let mins = Number.parseInt(mins_dum/60);
        let secs = Number.parseInt(mins_dum%60);

        hrs = (hrs < 10) ? `0${hrs}` : hrs;
        mins = (mins < 10) ? `0${mins}` : mins;
        secs = (secs < 10) ? `0${secs}` : secs;

        timer.innerHTML = hrs + ":" + mins + ":" + secs;
    }   

    timerID = setInterval(displayTimer , 1000);

}

function endTimer()
{
    clearInterval(timerID);
    timer.style.display = "none";
    timer.innerHTML = "00:00:00";
}

let filters = document.querySelectorAll(".filter");

filters.forEach((filterelem,idx) => {
    
    filterelem.addEventListener("click", (e) => {
        filterColor = getComputedStyle(filterelem).getPropertyValue("background-color");
    })
})
