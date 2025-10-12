const fs = require('fs');
const path = require('path');
const { dataDir } = require('../../config/appConfig');
const { getInitialWords } = require('../data/quranDataService');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function loadNoCounts(surahId, rukuId) {
  const unitId = `${surahId}_${rukuId}`;
  const filePath = path.join(dataDir, `${unitId}_noCounts.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return getInitialWords(surahId, rukuId).reduce((acc, item) => {
    acc[item.word] = 0;
    return acc;
  }, {});
}

function saveNoCounts(surahId, rukuId, noCounts) {
  const unitId = `${surahId}_${rukuId}`;
  const filePath = path.join(dataDir, `${unitId}_noCounts.json`);
  fs.writeFileSync(filePath, JSON.stringify(noCounts, null, 2));
}

function hasReviewData(surahId, rukuId) {
  const noCounts = loadNoCounts(surahId, rukuId);
  return Object.values(noCounts).some(count => count > 0);
}

function loadRevisionLists(surahId, rukuId) {
  const unitId = `${surahId}_${rukuId}`;
  const filePath = path.join(dataDir, `${unitId}_revisionLists.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return Array(5).fill(null);
}

function saveRevisionLists(surahId, rukuId, revisionLists) {
  const unitId = `${surahId}_${rukuId}`;
  const filePath = path.join(dataDir, `${unitId}_revisionLists.json`);
  fs.writeFileSync(filePath, JSON.stringify(revisionLists, null, 2));
}

module.exports = { loadNoCounts, saveNoCounts, hasReviewData, loadRevisionLists, saveRevisionLists };