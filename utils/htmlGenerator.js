function generateHtmlPage(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Word Learning App</title>
      <link rel="stylesheet" href="/styles.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <div class="container">
        ${content}
      </div>
    </body>
    </html>
  `;
}

module.exports = { generateHtmlPage };