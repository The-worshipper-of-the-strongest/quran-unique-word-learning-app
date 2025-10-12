const express = require('express');
const router = express.Router();
const { getSurahs, getSurahName } = require('../services/data/quranDataService');
const { generateHtmlPage } = require('../utils/htmlGenerator');

router.get('/', (req, res) => {
  const surahs = getSurahs();
  let homeHtml = `
    <h1>Welcome to Quran Word Learning App</h1>
    <p>Select a Surah to start:</p>
    <ul>
      ${surahs.map(surahId => `<li><a href="/surah/${surahId}">${getSurahName(surahId)}</a></li>`).join('')}
    </ul>
  `;
  res.send(generateHtmlPage(homeHtml));
});

module.exports = router;