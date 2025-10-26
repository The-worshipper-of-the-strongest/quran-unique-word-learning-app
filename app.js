const express = require('express');
const path = require('path');
const homeRouter = require('./routes/home');
const surahRouter = require('./routes/surah');
const rukuRouter = require('./routes/ruku');
const quizRouter = require('./routes/quiz');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', homeRouter);
app.use('/surah', surahRouter);
app.use('/surah', rukuRouter); // Shares /surah prefix
app.use('/surah', quizRouter); // Shares /surah prefix

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
