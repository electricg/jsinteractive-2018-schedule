const axios = require('axios');
const express = require('express');
const fs = require('fs');
const next = require('next');

const { parseData } = require('./src/utils');

const _package = require('./package.json');
const { version } = _package;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // custom handlers go here…
    server.get('/sw.js', (req, res) => {
      const content = fs.readFileSync(
        `${__dirname}/src/static/js/sw.js`,
        'utf8'
      );
      const js = content.replace('@VERSION@', version);
      res.set('Content-Type', 'application/javascript');
      res.send(js);
    });

    server.get('/schedule.json', async (req, res) => {
      const html = await axios.get('https://2018.jsconf.eu/schedule/');
      const schedule = parseData(html.data);

      res.set('Content-Type', 'application/json');
      res.send(schedule);
    });

    server.get('/schedule', (req, res) => {
      res.set('Content-Type', 'text/html');
      res.sendFile(`${__dirname}/src/data/schedule.html`);
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(3000, err => {
      if (err) {
        throw err;
      }
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
