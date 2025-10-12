const express = require('express');
const router = express.Router();
const { getSurahs, getSurahName, getRukusForSurah } = require('../services/data/quranDataService');
const { generateHtmlPage } = require('../utils/htmlGenerator');

router.get('/:surahId', (req, res) => {
  const surahId = req.params.surahId;
  if (!getSurahs().includes(surahId)) {
    return res.send(generateHtmlPage('<h1>Surah not found</h1>'));
  }
  const rukus = getRukusForSurah(surahId);
  let surahHtml = `
    <h1>${getSurahName(surahId)} Rukus</h1>
    <p>Select a Ruku to start:</p>
    <ul>
      ${rukus.map(rukuId => `<li><a href="/surah/${surahId}/ruku/${rukuId}">${rukuId.charAt(0).toUpperCase() + rukuId.slice(1)}</a></li>`).join('')}
    </ul>
    <a href="/">Back to Home</a>
  `;
  res.send(generateHtmlPage(surahHtml));
});

module.exports = router;