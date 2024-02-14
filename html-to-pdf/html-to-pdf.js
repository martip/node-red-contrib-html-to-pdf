const puppeteer = require('puppeteer');

const printPDF = async (html, options) => {
  //  const pathToHtml = path.join(__dirname, filename);
  let puppeteer_args;
  if (process.env && process.env.puppeteer_args) {
    try {
      puppeteer_args = process.env.puppeteer_args.split(',');
    } catch {
      puppeteer_args = [];
    }
  }

  const config = {
    headless: true,
  };

  if (puppeteer_args) {
    config.args = puppeteer_args;
  }

  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  //  await page.goto(`file:${pathToHtml}`, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf(options);

  await browser.close();
  return pdf;
};

module.exports = function (RED) {
  function HTMLToPDF(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    this.options = {};

    if (config.format === 'custom') {
      this.options.width =
        config.width !== '' && !isNaN(config.width)
          ? `${parseInt(config.width)}${config.widthUnit}`
          : 1024;
      this.options.height =
        config.height !== '' && !isNaN(config.height)
          ? `${parseInt(config.height)}${config.heightUnit}`
          : 768;
    }

    this.on('input', async (msg, send, done) => {
      const getOption = (name) => {
        const property = msg.hasOwnProperty(name) ? msg[name] : config[name];
        return property;
      };

      this.options.landscape =
        getOption('orientation').toLowerCase().trim() === 'landscape';
      this.options.omitBackground = getOption('omitBackground');
      this.options.printBackground = getOption('printGraphics');
      try {
        this.options.scale = getOption('zoom') / 100;
      } catch (error) {
        this.options.scale = 1;
      }

      this.options.margin = {
        top: `${getOption('marginTop')}${getOption('marginTopUnits')}`,
        left: `${getOption('marginLeft')}${getOption('marginLeftUnits')}`,
        bottom: `${getOption('marginBottom')}${getOption('marginBottomUnits')}`,
        right: `${getOption('marginRight')}${getOption('marginRightUnits')}`,
      };

      if (msg.hasOwnProperty('payload')) {
        try {
          const pdf = await printPDF(msg.payload, this.options);
          msg.payload = pdf;

          send(msg);
          done();
        } catch (error) {
          done(error);
        }
      } else {
        // If no payload just pass it on.
        send(msg);
        done();
      }

      // Out

      // Once finished, call 'done'.
      // This call is wrapped in a check that 'done' exists
      // so the node will work in earlier versions of Node-RED (<1.0)
      if (done) {
        done();
      }
    });
  }

  RED.nodes.registerType('html-to-pdf', HTMLToPDF);
};
