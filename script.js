let songs = [];

window.addEventListener('DOMContentLoaded', () => {
  fetch('/songs')
    .then(response => response.json())
    .then(data => {
      songs = data;
      renderSongs(songs);
    });
});

function renderSongs(songs) {
  const songList = document.getElementById('songList');
  songList.innerHTML = '';

  songs.forEach(song => {
    const listItem = document.createElement('li');

    const songTitle = document.createElement('span');
    songTitle.textContent = song.title;
    listItem.appendChild(songTitle);

    listItem.addEventListener('click', () => {
      loadSong(song.file);
    });

    const downloadLink = document.createElement('a');
    downloadLink.href = song.file;
    downloadLink.download = song.title; // This will make it download
    downloadLink.innerHTML = '<i class="fas fa-download"></i>';
    downloadLink.addEventListener('click', (event) => {
      event.stopPropagation(); // prevent the song from playing when the download button is clicked
    });
    listItem.appendChild(downloadLink);

    songList.appendChild(listItem);
  });
}

function loadSong(file) {
  const audioPlayer = document.getElementById('audioPlayer');
  audioPlayer.src = file;
  audioPlayer.play();
}

function searchSong() {
  const searchTerm = document.querySelector('.search input').value.toLowerCase();
  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm));
  renderSongs(filteredSongs);
}