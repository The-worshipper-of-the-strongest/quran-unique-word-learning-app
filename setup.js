const fs = require('fs');
const path = require('path');

const baseDir = 'word-learning-app';

const structure = {
  config: ['appConfig.js'],
  'data/static': ['decks.js'],
  public: ['index.html', 'styles.css', 'script.js'],
  routes: ['index.js'],
  services: ['deckService.js', 'persistenceService.js'],
  utils: ['htmlGenerator.js'],
  'node_modules': [],
  '': ['app.js', 'package.json']
};

for (const [folder, files] of Object.entries(structure)) {
  const dirPath = folder === '' ? baseDir : path.join(baseDir, folder);
  fs.mkdirSync(dirPath, { recursive: true });

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    fs.writeFileSync(filePath, '', 'utf8');
  });
}

console.log('✅ Updated project structure created successfully!');