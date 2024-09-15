var audio = document.getElementById("audio");
var play = document.getElementById("play");

var volController = document.getElementById("volController");
var volValue = volController.children[3];
var rangeBar = volController.children[0];

var progressBar = document.getElementById("progressBar");

var info = document.getElementById("info");
var musicPool = document.getElementById("musicPool");

var book = document.getElementById("book");
var bookSource = book.children[0];
var bookTarget = book.children[1];



//執行初始設定的function
setVolumeByRangBar(); //設定初始音量

function showBook() {

    book.style.display = book.style.display == "flex" ? "none" : "flex";
}


//更新音樂池
function updateMusicPool() {
    //清空音樂池
    for (var i = musicPool.children.length - 1; i >= 0; i--) {
        musicPool.remove(i);
    }


    //讀取bookTarget裡的歌給音樂池
    for (var i = 0; i < bookTarget.children.length; i++) {
        var option = document.createElement("option");

        option.value = bookTarget.children[i].title;
        option.innerText = bookTarget.children[i].innerText;

        musicPool.appendChild(option);
    }
    changeMusic(0);
}

//====drag & drop的功能區=====

function allowDrop(ev) {
    ev.preventDefault();  //放棄物件預設行為
}

function drag(ev) {
    ev.dataTransfer.setData("a", ev.target.id);  //抓取正在拖曳的物件
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("a");
    //console.log(ev.target);

    if (ev.target.id == "")
        ev.target.appendChild(document.getElementById(data));
    else
        ev.target.parentNode.appendChild(document.getElementById(data));
}

//初始化音樂池
function InitMusicPool() {
    for (var i = 0; i < bookSource.children.length; i++) {
        var option = document.createElement("option");
        bookSource.children[i].id = "song" + (i + 1);
        bookSource.children[i].draggable = "true";
        bookSource.children[i].ondragstart = drag;

        option.value = bookSource.children[i].title;
        option.innerText = bookSource.children[i].innerText;

        musicPool.appendChild(option);
    }
    changeMusic(0);
}
InitMusicPool();


//啟動隨機、單曲、全部循環的播放狀態
function setFuncBtnStatus() {
    //console.log(event.target);
    //console.log(event.target.title);
    //console.log(event.target.innerText);

    for (var i = 9; i < controlPanel.children.length; i++) {
        controlPanel.children[i].className = "";
    }

    event.target.className = info.children[2].innerText != event.target.title ? "btnBColor" : "";
    info.children[2].innerText = info.children[2].innerText != event.target.title ? event.target.title : "正常";

}


//啟動隨機播放狀態
/*   function setAllLoop() {

      event.target.className = info.children[2].innerText != "全部循環" ? "btnBColor" : "";
      info.children[2].innerText = info.children[2].innerText != "全部循環" ? "全部循環" : "正常";
      controlPanel.children[9].className = "";
      controlPanel.children[10].className = "";
  } */

//啟動隨機播放狀態
/*  function setRandom() {

     event.target.className = info.children[2].innerText != "隨機播放" ? "btnBColor" : "";
     info.children[2].innerText = info.children[2].innerText != "隨機播放" ? "隨機播放" : "正常";
     controlPanel.children[9].className = "";
     controlPanel.children[11].className = "";
 } */


//啟動單曲循環狀態
/*   function setLoop() {
      //alert('啟動單曲循');
      event.target.className = info.children[2].innerText != "單曲循環" ? "btnBColor" : "";
      info.children[2].innerText = info.children[2].innerText != "單曲循環" ? "單曲循環" : "正常";
      controlPanel.children[11].className = "";
      controlPanel.children[10].className = "";
  }
*/

//換歌時,若播放器狀態為播放中,則直接播放,若播放器狀態為非播放中,則暫不播放
//換歌時會有進度點錯誤


function getMusicStatus() {
    if (audio.currentTime == audio.duration) {
        if (info.children[2].innerText == "隨機播放") {
            //隨機選一首歌來播
            var r = Math.floor(Math.random() * musicPool.children.length);
            r -= musicPool.selectedIndex;
            changeMusic(r);
        }
        else if (info.children[2].innerText == "單曲循環") {
            changeMusic(0);
        }
        else if (info.children[2].innerText == "全部循環" && musicPool.selectedIndex == musicPool.children.length - 1) {
            //換到第一首
            changeMusic(0 - musicPool.selectedIndex);
        }
        else if (musicPool.selectedIndex == musicPool.children.length - 1)
            stopMusic();
        else
            changeMusic(1);
    }
    //console.log(audio.loop);
}

//換歌
function changeMusic(n) {
    //console.log(musicPool.selectedIndex);

    var i = musicPool.selectedIndex + n;
    audio.src = musicPool.children[i].value;
    audio.title = musicPool.children[i].innerText;
    musicPool.children[i].selected = true;

    clearInterval(ProgressTaskID);

    if (play.innerText == ";") {
        audio.onloadeddata = playMusic;
    }


}


//時間格式
function getTimeFormat(t) {

    var m = parseInt(t / 60);
    var s = parseInt(t) % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    return m + ":" + s;
}


//取得時間在資訊看板中顯示
function getTimerForInfo() {
    info.children[1].innerText = getTimeFormat(audio.currentTime) + "/" + getTimeFormat(audio.duration);

}



//從進度條改變歌曲時間位置
function setProgress() {
    //console.log(progressBar.value);
    audio.currentTime = progressBar.value / 10000;
}

//取得進度條資訊
function getProgress() {
    //console.log(parseInt(audio.currentTime));
    console.log('a');
    var w = audio.currentTime / audio.duration * 100;
    progressBar.value = audio.currentTime * 10000;
    //console.log(progressBar.value);
    progressBar.style.backgroundImage = `-webkit-linear-gradient(left,rgb(197, 7, 0) ${w}%, rgb(236, 236, 234) ${w}%)`;
}

//靜音功能(使用反轉布林值技巧)
function setMuted() {
    audio.muted = !audio.muted;
}

//audio.volume = 0.1;

//用拖曳方式調整音量
function setVolumeByRangBar() {
    audio.volume = rangeBar.value / 100;
    volValue.value = rangeBar.value;
    rangeBar.style.backgroundImage = `-webkit-linear-gradient(left,rgb(41, 97, 43) ${rangeBar.value}%, rgb(236, 236, 234) ${rangeBar.value}%)`;

}
//用按鈕微調音量
function setVolumeByButton(v) {
    rangeBar.value = parseInt(rangeBar.value) + v;
    setVolumeByRangBar();

}


//參數化
//音樂快轉倒轉
function changeTime(t) {
    audio.currentTime += t;
}



var ProgressTaskID;
//播放音樂功能

//抓不到audio的duration
function playMusic() {

    audio.play();
    play.innerText = ";";
    play.onclick = pauseMusic;
    progressBar.max = audio.duration * 10000;
    //console.log(audio.duration);

    ProgressTaskID = setInterval(function () {
        getProgress();
        getTimerForInfo();
        getMusicStatus();
    }, 1);

    info.children[0].innerText = "現正播放:" + audio.title;
    var image = document.getElementById('photo2');
    image.style.animation = 'scaleAnimation 0.3s infinite alternate';


}




//暫停音樂功能
function pauseMusic() {
    audio.pause();
    play.innerText = "4";
    play.onclick = playMusic;
    getProgress();
    clearInterval(ProgressTaskID);

    info.children[0].innerText = "音樂暫停";
    var image = document.getElementById('photo2');
    image.style.animation = 'none';
}

//停止音樂功能
function stopMusic() {
    pauseMusic();
    //然後把時間歸零
    audio.currentTime = 0;
    getProgress();
    clearInterval(ProgressTaskID);

    info.children[0].innerText = "音樂停止";
    var image = document.getElementById('photo2');
    image.style.animation = 'none';
}

window.onload = function () {
    // 将动画初始状态设置为静止
    var image = document.getElementById('photo2');
    image.style.animation = 'none';
};