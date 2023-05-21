let songs = [];

window.addEventListener('DOMContentLoaded', () => {
  AOS.init(); // initialize AOS
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
    listItem.setAttribute('data-aos', 'fade-up'); // add AOS attribute

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
  const allSongs = document.querySelectorAll('#songList li');
  allSongs.forEach(song => song.classList.remove('playing'));
  audioPlayer.src = file;
  audioPlayer.play();

  const currentSong = [...allSongs].find(song => song.querySelector('a').href === location.origin + file);
  if (currentSong) currentSong.classList.add('playing');
}

function searchSong() {
  const searchTerm = document.querySelector('.search input').value.toLowerCase();
  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchTerm));
  renderSongs(filteredSongs);
}
