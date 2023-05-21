import express from 'express';
import musicMetadata from 'music-metadata';
import recursive from 'recursive-readdir';

const app = express();
const PORT = 1486;
const mp3Folder = process.cwd(); 

app.use(express.static(mp3Folder)); 

app.get('/', (req, res) => {
  res.redirect('/songs');
});

app.get('/songs', async (req, res) => {
  const mp3Files = [];
  const files = await recursive(mp3Folder, ['!*.mp3']);

  for (let file of files) {
    const metadata = await musicMetadata.parseFile(file);
    let title = metadata.common.title;
    if (!title) {
      title = file.split('/').pop(); 
    }
    mp3Files.push({
      title: title,
      artist: metadata.common.artist,
      file: file.replace(mp3Folder, ''),
    });
  }

  mp3Files.sort((a, b) => a.title.localeCompare(b.title));

  res.json(mp3Files);
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
