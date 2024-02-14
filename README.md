# node-red-contrib-html-to-pdf

A [Node-RED](https://nodered.org/) node that converts HTML to PDF, using the [Puppeteer](https://pptr.dev/) library.

## Install

Either use the `Node-RED Menu - Manage Palette - Install`, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-html-to-pdf

## Usage

You pass the HTML source code in the `msg.payload`.

Various options can be set in the node configuration dialog or set as properties of `msg`:

- Format (letter, legal, tabloid, ledger, A0, A1, A2, A3, A4, A5, A6, custom)
- Orientation (portrait, landscape); `msg.orientation`
- Zoom (10% to 200%); `msg.zoom` (number)
- Margins; `msg.marginTop`, `msg.marginTopUnits`, `msg.marginLeft` etc.
- Transparent background; `msg.omitBackground` (`true` or `false`)
- Show or hide background graphics; `msg.printGraphics` (`true` or `false`)
