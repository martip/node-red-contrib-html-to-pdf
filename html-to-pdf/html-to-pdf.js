const puppeteer = require('puppeteer')

const printPDF = async (html, options) => {

//  const pathToHtml = path.join(__dirname, filename);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

//  await page.goto(`file:${pathToHtml}`, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf(options);
 
  await browser.close();
  return pdf
};


module.exports = function(RED) {

  function HTMLToPDF(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    this.options = {};

    this.options.format = config.format;
    if (this.options.format === 'custom') {
      this.options.width = config.width !== '' && !isNaN(config.width) ? parseInt(config.width) : 1024;
      this.options.height = config.height !== '' && !isNaN(config.height) ? parseInt(config.height) : 768;
    }
    this.options.landscape = config.orientation === 'Landscape';
    this.options.omitBackground = config.omitBackground;
    this.options.printBackground = config.printGraphics;
    this.options.scale = config.zoom / 100;

    this.options.margin = {
      top: `${config.marginTop}${config.marginTopUnits}`,
      left: `${config.marginLeft}${config.marginLeftUnits}`,
      bottom: `${config.marginBottom}${config.marginBottomUnits}`,
      right: `${config.marginRight}${config.marginRightUnits}`
    }
    
  
    this.on('input', async (msg, send, done) => {

      if (msg.hasOwnProperty('payload')) {        

        try {
          const pdf  = await printPDF(msg.payload, this.options);
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
  };

  RED.nodes.registerType('html-to-pdf', HTMLToPDF);

};