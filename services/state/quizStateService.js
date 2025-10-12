const { getInitialWords } = require('../data/quranDataService');
const { loadNoCounts, loadRevisionLists, saveRevisionLists } = require('../persistence/persistenceService');

// In-memory state
let currentWords = {};
let noCounts = {};
let revisionLists = {};
let lastListStarted = {};
let isFirstSubmission = {};

function getRukuData(surahId, rukuId) {
  const unitId = `${surahId}_${rukuId}`;
  if (!currentWords[unitId]) {
    noCounts[unitId] = loadNoCounts(surahId, rukuId);
    currentWords[unitId] = getInitialWords(surahId, rukuId);
    revisionLists[unitId] = loadRevisionLists(surahId, rukuId);
    lastListStarted[unitId] = 'fresh';
    isFirstSubmission[unitId] = true;
  }
  return { words: currentWords[unitId], noCounts: noCounts[unitId], revisionLists: revisionLists[unitId] };
}

function startFresh(surahId, rukuId) {
  const unitId = `${surahId}_${rukuId}`;
  currentWords[unitId] = getInitialWords(surahId, rukuId);
  noCounts[unitId] = loadNoCounts(surahId, rukuId);
  revisionLists[unitId] = loadRevisionLists(surahId, rukuId);
  lastListStarted[unitId] = 'fresh';
  isFirstSubmission[unitId] = true;
}

function startRevision(surahId, rukuId, listNumber) {
  const unitId = `${surahId}_${rukuId}`;
  noCounts[unitId] = loadNoCounts(surahId, rukuId);
  revisionLists[unitId] = loadRevisionLists(surahId, rukuId);
  const revisionList = revisionLists[unitId][listNumber - 1];
  currentWords[unitId] = revisionList ? revisionList.words : [];
  lastListStarted[unitId] = `revision${listNumber}`;
  isFirstSubmission[unitId] = true;
}

function updateWords(surahId, rukuId, newWords, formData) {
  const unitId = `${surahId}_${rukuId}`;
  Object.keys(formData).forEach((key) => {
    if (key.startsWith('knows_') && formData[key] === 'no') {
      const index = parseInt(key.split('_')[1]);
      const word = currentWords[unitId][index]?.word;
      if (word && noCounts[unitId][word] !== undefined) {
        noCounts[unitId][word]++;
      }
    }
  });
  if (isFirstSubmission[unitId] && newWords.length > 0) {
    const lastStarted = lastListStarted[unitId] || 'fresh';
    if (lastStarted === 'fresh') {
      revisionLists[unitId][0] = { words: newWords, timestamp: new Date().toLocaleString('en-IN') };
    } else if (lastStarted.startsWith('revision')) {
      const listNum = parseInt(lastStarted.replace('revision', ''));
      if (listNum < 5) {
        revisionLists[unitId][listNum] = { words: newWords, timestamp: new Date().toLocaleString('en-IN') };
      }
    }
    saveRevisionLists(surahId, rukuId, revisionLists[unitId]);
    isFirstSubmission[unitId] = false;
  }
  currentWords[unitId] = newWords;
}

function resetRuku(surahId, rukuId) {
  const unitId = `${surahId}_${rukuId}`;
  currentWords[unitId] = getInitialWords(surahId, rukuId);
  noCounts[unitId] = loadNoCounts(surahId, rukuId);
  revisionLists[unitId] = loadRevisionLists(surahId, rukuId);
  lastListStarted[unitId] = 'fresh';
  isFirstSubmission[unitId] = true;
}

module.exports = { getRukuData, startFresh, startRevision, updateWords, resetRuku };