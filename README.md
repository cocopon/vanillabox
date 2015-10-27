Vanillabox [![Build Status](https://travis-ci.org/cocopon/vanillabox.png?branch=master)](https://travis-ci.org/cocopon/vanillabox)
==========


Overview
--------
Vanillabox is a simple, modern [Lightbox](http://lokeshdhakar.com/projects/lightbox2/)-like plugin for [jQuery](http://jquery.com/).
You can easily setup your image gallery with this plugin.

See the [official page](http://cocopon.me/app/vanillabox/) for more information.


Why Vanillabox?
---------------
- Simple design, no decoration. It focuses your content.
- Suitable for modern browsers that include mobile ones.
  It works nicely whether or not to zoom a page.
- Free for commercial use.
  It's licenced under the [MIT License](http://opensource.org/licenses/MIT).


System Requirements
-------------------
- jQuery 1.7+
- Chrome, Firefox, Safari, Opera, Internet Explorer 9+,
  iOS 6+ (Safari), Android 4.1.2+ (AOSP, Chrome)


How to Build Your Own Vanillabox
--------------------------------
If you just want to use Vanillabox, get a compressed file from the [official page](http://cocopon.me/app/vanillabox/getting_started.html).
You may not need to perform the following steps.

First, these commands are required to setup a development environment:

- [Node.js/npm](http://nodejs.org/) 4.0+

Install required npm packages:

```bash
npm install -g gulp
```

Next, clone the repository and get source files:

```bash
git clone https://github.com/cocopon/vanillabox
```

Then move into the project directory, and run npm to install required npm packages:

```bash
cd path/to/vanillabox
npm install
```

All done!
Now you can use gulp tasks for development.

```bash
gulp build
```


### Common Gulp Tasks

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `gulp test`       | Runs unit tests                            |
| `gulp js`         | Generates an uncompressed JS file          |
| `gulp sass:theme` | Translates theme SCSS files into CSS files |
| `gulp js:dist`    | Compiles JS files                          |
| `gulp dist`       | Generates a package archive                |
