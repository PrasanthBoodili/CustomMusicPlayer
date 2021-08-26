const musicList = document.querySelector(".music-list"),
  musicPlayer = document.querySelector(".musicPlayer"),
  image = musicPlayer.querySelector(".image-section img"),
  songName = musicPlayer.querySelector(".song-details .song"),
  songArtist = musicPlayer.querySelector(".song-details .artist"),
  mainAudio = musicPlayer.querySelector("#main-audio"),
  playPause = musicPlayer.querySelector(".play-pause"),
  previous = musicPlayer.querySelector("#prev"),
  next = musicPlayer.querySelector("#next"),
  progressSection = musicPlayer.querySelector(".progress-section"),
  progressBar = musicPlayer.querySelector(".progress-bar"),
  openMore = musicPlayer.querySelector("#more-music"),
  closeMore = musicList.querySelector("#close");

let musicIndex = 3;

// loading of music when window loaded
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

function loadMusic(index) {
  songName.innerText = allMusic[index - 1].name;
  songArtist.innerText = allMusic[index - 1].artist;
  image.src = `images/${allMusic[index - 1].img}.jpeg`;
  mainAudio.src = `song/${allMusic[index - 1].src}.mp3`;
}

// play music
function playMusic() {
  musicPlayer.classList.add("paused");
  playPause.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// pause music
function pauseMusic() {
  musicPlayer.classList.remove("paused");
  playPause.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}
// playPause button action
playPause.addEventListener("click", () => {
  const isPaused = musicPlayer.classList.contains("paused");
  isPaused ? pauseMusic() : playMusic();
  playingNow();
});

// next song  by clicking on next button
next.addEventListener("click", () => {
  nextSong();
});
// prev song by clicking on prev buttonn
previous.addEventListener("click", () => {
  prevSong();
});

// nextSong function
function nextSong() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// prevSong function
function prevSong() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = musicPlayer.querySelector(".current");
  let musicDurationTime = musicPlayer.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    // duration time
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDurationTime.innerText = `${totalMin}:${totalSec}`;
  });
  // progressing time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//chaging time acc to progress bbar width
progressSection.addEventListener("click", (e) => {
  let progressWidthValue = progressSection.clientWidth;
  let clickedOffsetx = e.offsetX;
  let songduration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffsetx / progressWidthValue) * songduration;
  playMusic();
});

//creating of repeat menu
const repeat = musicPlayer.querySelector("#repeat-plist");
repeat.addEventListener("click", () => {
  let getText = repeat.innerText;
  switch (getText) {
    case "repeat":
      repeat.innerText = "repeat_one";
      repeat.setAttribute("title", "Song Looped");
      break;
    case "repeat_one":
      repeat.innerText = "shuffle";
      repeat.setAttribute("title", "Playback Shuffled");
      break;
    case "shuffle":
      repeat.innerText = "repeat";
      repeat.setAttribute("title", "Playlist Looperd");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  let getText = repeat.innerText;
  switch (getText) {
    case "repeat":
      nextSong();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }
});

openMore.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMore.addEventListener("click", () => {
  openMore.click();
});

const ulTag = musicPlayer.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index = "${i + 1}">
                            <div class="row">
                                <span>${allMusic[i].name}</span>
                                <p>${allMusic[i].artist}</p>
                            </div>
                            <audio class ='${allMusic[i].src}' src = 'song/${allMusic[i].src}.mp3'></audio>
                            <span id="${
                              allMusic[i].src
                            }" class = "audio-duration"></span>
                        </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioTagDuration.setAttribute("t-duration", `${totalMin}: ${totalSec}`);
  });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let songDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = songDuration;
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "playing";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

// lets play song on click
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// mode
let mode = musicPlayer.querySelector("#mode");
mode.addEventListener("click", () => {
  if (mode.innerText == "light_mode") {
    mode.innerText = "dark_mode";
    musicPlayer.style.background = "white";
    musicPlayer.style.color = "black";
    progressSection.style.background = "#f0f0f0";
    playPause.style.background = "white";
    musicPlayer.querySelector(".top-section i").style.color = "#515c6f";
    mode.style.color = "#515c6f";
    musicList.style.background = "white";
    musicList.style.color = "#515c6f";
  } else {
    mode.innerText = "light_mode";
    musicPlayer.style.background = "black";
    musicPlayer.style.color = "white";
    progressSection.style.background = "#6a6b6b";
    playPause.style.background = "black";
    musicPlayer.querySelector(".top-section i").style.color = "#f0f0f0";
    mode.style.color = "#f0f0f0";
    musicList.style.background = "black";
    musicList.style.color = "#f0f0f0";
  }
});
