let songs = [];

window.addEventListener('DOMContentLoaded', () => {
  fetch('/songs')
    .then(response => response.json())
    .then(data => {
      songs = data;
      renderSongs(songs);
    });
  AOS.init();
});

function renderSongs(songs) {
  const songList = document.getElementById('songList');
  songList.innerHTML = '';

  songs.forEach(song => {
    const listItem = document.createElement('li');

    const selectBox = document.createElement('input');
    selectBox.type = 'checkbox';
    selectBox.className = 'song-checkbox';
    listItem.appendChild(selectBox);

    const songTitle = document.createElement('span');
    songTitle.textContent = song.title;
    listItem.appendChild(songTitle);

    listItem.addEventListener('click', () => {
      if (!selectBox.checked) {
        loadSong(song.file);
      }
    });

    const downloadLink = document.createElement('a');
    downloadLink.href = song.file;
    downloadLink.download = song.title;
    downloadLink.innerHTML = '<i class="fas fa-download"></i>';
    downloadLink.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    listItem.appendChild(downloadLink);

    songList.appendChild(listItem);
  });

  const checkboxes = document.querySelectorAll('.song-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', toggleDownloadButton);
  });
}

function loadSong(file) {
  const audioPlayer = document.getElementById('audioPlayer');
  const playerControls = document.getElementById('playerControls');
  audioPlayer.src = file;
  playerControls.classList.remove('hidden');
  audioPlayer.play();
}

function toggleDownloadButton() {
  const checkboxes = document.querySelectorAll('.song-checkbox:checked');
  const downloadButton = document.getElementById('downloadBtn');
  downloadButton.style.display = checkboxes.length > 0 ? 'block' : 'none';
}

document.getElementById('downloadBtn').addEventListener('click', () => {
  const checkboxes = document.querySelectorAll('.song-checkbox:checked');
  checkboxes.forEach(checkbox => {
    const downloadLink = checkbox.parentElement.querySelector('a');
    downloadLink.click();
  });
});

// New function to format song titles starting with "AUD-"
function formatSongTitle(song) {
  if (song.title.startsWith("AUD-")) {
    const parts = song.title.split(" - ");
    if (parts.length === 2) {
      return `${parts[1]} - ${parts[0]}`;
    }
  }
  return song.title;
}

window.addEventListener('DOMContentLoaded', () => {
  fetch('/songs')
    .then(response => response.json())
    .then(data => {
      songs = data;
      songs.forEach(directory => {
        directory.songs.forEach(song => {
          song.title = formatSongTitle(song);
        });
      });
      renderSongs(songs);
    });
  AOS.init();
});

function renderFolderContent(songs) {
  const songList = document.getElementById('songList');
  songList.innerHTML = '';

  songs.forEach(song => {
    const listItem = document.createElement('li');

    const selectBox = document.createElement('input');
    selectBox.type = 'checkbox';
    selectBox.className = 'song-checkbox';
    selectBox.addEventListener('change', toggleDownloadButton);
    listItem.appendChild(selectBox);

    const songTitle = document.createElement('span');
    songTitle.textContent = formatSongTitle(song);
    listItem.appendChild(songTitle);

    listItem.addEventListener('click', () => {
      loadSong(song.file);
    });

    const downloadLink = document.createElement('a');
    downloadLink.href = song.file;
    downloadLink.download = song.title;
    downloadLink.innerHTML = '<i class="fas fa-download"></i>';
    downloadLink.addEventListener('click', (event) => {
      event.stopPropagation();
    });
    listItem.appendChild(downloadLink);

    songList.appendChild(listItem);
  });
}
