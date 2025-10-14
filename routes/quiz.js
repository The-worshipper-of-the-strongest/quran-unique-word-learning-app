const express = require('express');
const router = express.Router();
const { getSurahName } = require('../services/data/quranDataService');
const { getRukuData, updateWords, resetRuku } = require('../services/state/quizStateService');
const { saveNoCounts } = require('../services/state/quizStateService');
const { generateHtmlPage } = require('../utils/htmlGenerator');

router.get('/:surahId/ruku/:rukuId/quiz', (req, res) => {
  const surahId = req.params.surahId;
  const rukuId = req.params.rukuId;
  const { words, noCounts } = getRukuData(surahId, rukuId);
  if (words.length === 0) {
    saveNoCounts(surahId, rukuId, noCounts);
    let summaryHtml = `
      <h1>${getSurahName(surahId)} ${rukuId.charAt(0).toUpperCase() + rukuId.slice(1)} Summary</h1>
      <p>All words have been learned or no words available for this list!</p>
      <ul>
        ${Object.entries(noCounts)
          .map(([word, count]) => `<li>${word}: ${count} time(s)</li>`)
          .join('')}
      </ul>
      <a href="/surah/${surahId}/ruku/${rukuId}/reset">Restart This Ruku</a><br>
      <a href="/surah/${surahId}/ruku/${rukuId}">Back to Options</a><br>
      <a href="/surah/${surahId}">Back to Rukus</a><br>
      <a href="/">Back to Home</a>
    `;
    res.send(generateHtmlPage(summaryHtml));
  } else {
    let wordListHtml = `
      <h1>${getSurahName(surahId)} ${rukuId.charAt(0).toUpperCase() + rukuId.slice(1)} Word Meaning Pairs</h1>
      <form action="/surah/${surahId}/ruku/${rukuId}/submit" method="POST">
        ${words
          .map(
            (item, index) => `
              <div class="word-item">
                <p><strong>Word:</strong> ${item.word} <br> 
                   <strong>Meaning:</strong> <span class="meaning hidden" id="meaning_${index}">${item.meaning}</span>
                   <button type="button" class="show-meaning" data-index="${index}">Show</button>
                </p>
                <label><input type="radio" name="knows_${index}" value="yes" required> Yes</label>
                <label><input type="radio" name="knows_${index}" value="no"> No</label>
              </div>
            `
          )
          .join('')}
        <button type="submit">Submit</button>
      </form>
      <a href="/surah/${surahId}">Back to Rukus</a>
    `;
    res.send(generateHtmlPage(wordListHtml));
  }
});

router.post('/:surahId/ruku/:rukuId/submit', (req, res) => {
  const surahId = req.params.surahId;
  const rukuId = req.params.rukuId;
  const { words, noCounts } = getRukuData(surahId, rukuId);
  let newWords = [];
  words.forEach((item, index) => {
    const knows = req.body[`knows_${index}`];
    if (knows === 'no') {
      newWords.push(item);
    }
  });
  updateWords(surahId, rukuId, newWords, req.body);
  saveNoCounts(surahId, rukuId, noCounts);
  res.redirect(`/surah/${surahId}/ruku/${rukuId}/quiz`);
});

router.get('/:surahId/ruku/:rukuId/reset', (req, res) => {
  const surahId = req.params.surahId;
  const rukuId = req.params.rukuId;
  resetRuku(surahId, rukuId);
  res.redirect(`/surah/${surahId}/ruku/${rukuId}`);
});

module.exports = router;