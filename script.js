const file_name_list = document.querySelector(".file_name_list");
const file_name_title = document.querySelector(".file_name_title");
const fileInput = document.getElementById('fileInput');
const videoPlayer = document.getElementById('videoPlayer');
const audioPlayer = document.getElementById('audioPlayer');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');

let files = [];
let currentIndex = 0;

fileInput.addEventListener('change', () => {
    files = Array.from(fileInput.files);
    currentIndex = 0;
    playCurrentFile();
});

function playCurrentFile() {
    if (files.length === 0) return;

    stopAll();

    const file = files[currentIndex];
    const url = URL.createObjectURL(file);
    const file_name = file.name;

    file_name_title.innerHTML = `<h1>目前播放檔案: ${file_name}</h1>`;
    
    file_name_list.innerHTML = '';

    for(var i = 0; i < files.length; i++){
        var add_file_name = document.createElement("li");
        var text = `${i + 1}.` + files[i].name;
        add_file_name.textContent =  text;
        file_name_list.append(add_file_name);            
    }

    if (file.type.startsWith('video')) {
        videoPlayer.src = url;
        videoPlayer.style.display = 'block';
        audioPlayer.style.display = 'none';
        progressContainer.style.display = 'none';
        videoPlayer.play();
        videoPlayer.onended = playNextFile;
        videoPlayer.ontimeupdate = updateProgressBar;
    } else if (file.type.startsWith('audio')) {
        audioPlayer.src = url;
        audioPlayer.style.display = 'block';
        videoPlayer.style.display = 'none';
        progressContainer.style.display = 'block';
        audioPlayer.play();
        audioPlayer.onended = playNextFile;
        audioPlayer.ontimeupdate = updateProgressBar;
    }
}

function playNextFile() {
    currentIndex = (currentIndex + 1) % files.length;
    playCurrentFile();
}

function stopAll() {
    videoPlayer.pause();
    audioPlayer.pause();
    videoPlayer.currentTime = 0;
    audioPlayer.currentTime = 0;
    progressBar.value = 0;
}

function updateProgressBar() {
    const player = videoPlayer.style.display === 'block' ? videoPlayer : audioPlayer;
    progressBar.value = player.currentTime / player.duration;
}

progressBar.addEventListener('input', () => {
    const player = videoPlayer.style.display === 'block' ? videoPlayer : audioPlayer;
    player.currentTime = progressBar.value * player.duration;
});