import express from 'express';
import musicMetadata from 'music-metadata';
import recursive from 'recursive-readdir';
import path from 'path';

const app = express();
const PORT = 1486;
const mp3Folder = process.cwd(); 

app.use(express.static(mp3Folder)); 

app.get('/', (req, res) => {
  res.redirect('/songs');
});

app.get('/songs', async (req, res) => {
  const fileMap = new Map();
  const files = await recursive(mp3Folder, ['!*.mp3']);

  for (let file of files) {
    const dir = path.dirname(file);
    const metadata = await musicMetadata.parseFile(file);
    let title = metadata.common.title;
    if (!title) {
      title = path.basename(file); 
    }
    const song = {
      title: title,
      artist: metadata.common.artist,
      file: file.replace(mp3Folder, ''),
    };
    if (!fileMap.has(dir)) {
      fileMap.set(dir, []);
    }
    fileMap.get(dir).push(song);
  }

  const directoryList = [];
  for (let [dir, songs] of fileMap.entries()) {
    songs.sort((a, b) => a.title.localeCompare(b.title));
    directoryList.push({
      name: path.basename(dir),
      songs: songs
    });
  }

  directoryList.sort((a, b) => a.name.localeCompare(b.name));

  res.json(directoryList);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
