const express = require('express');
const router = express.Router();
const { getRukusForSurah, getSurahName } = require('../services/data/quranDataService');
const { getRukuData, startFresh, startRevision } = require('../services/state/quizStateService');
const { generateHtmlPage } = require('../utils/htmlGenerator');

router.get('/:surahId/ruku/:rukuId', (req, res) => {
  const surahId = req.params.surahId;
  const rukuId = req.params.rukuId;
  if (!getRukusForSurah(surahId).includes(rukuId)) {
    return res.send(generateHtmlPage('<h1>Ruku not found</h1>'));
  }

  const { revisionLists } = getRukuData(surahId, rukuId);
  let optionsHtml = `
    <h1>${getSurahName(surahId)} ${rukuId.charAt(0).toUpperCase() + rukuId.slice(1)} Options</h1>
    <p>Choose how to start:</p>
    <form action="/surah/${surahId}/ruku/${rukuId}/start" method="POST">
      <label><input type="radio" name="mode" value="fresh" required> Start from start (fresh list)</label><br>
      ${revisionLists.map((list, index) => `
        <label><input type="radio" name="mode" value="revision${index + 1}" ${list ? '' : 'disabled'}>
          Revision list no ${index + 1} (${list ? list.timestamp : 'Not yet created'})
        </label><br>
      `).join('')}
      <button type="submit">Continue</button>
    </form>
    <a href="/surah/${surahId}">Back to Rukus</a>
  `;
  res.send(generateHtmlPage(optionsHtml));
});

router.post('/:surahId/ruku/:rukuId/start', (req, res) => {
  const surahId = req.params.surahId;
  const rukuId = req.params.rukuId;
  const mode = req.body.mode;
  if (mode.startsWith('revision')) {
    const listNumber = parseInt(mode.replace('revision', ''));
    startRevision(surahId, rukuId, listNumber);
  } else {
    startFresh(surahId, rukuId);
  }
  res.redirect(`/surah/${surahId}/ruku/${rukuId}/quiz`);
});

module.exports = router;