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

- [Node.js/npm](http://nodejs.org/) 0.10+
- [Ruby/RubyGems](https://www.ruby-lang.org/) 1.8.7+

Install gems and npm packages:

```bash
gem install sass -v '>=3.2'
npm install -g grunt-cli
```

You also need to install Closure Compiler to compress JS files:

```bash
git clone https://code.google.com/p/closure-compiler COMPILER_HOME
cd COMPILER_HOME
ant
export COMPILER_PATH=COMPILER_HOME
```

Next, clone the repository and get source files:

```bash
git clone https://github.com/cocopon/vanillabox VANILLA_HOME
```

Then move into the project directory, and run npm to install required npm packages:

```bash
cd VANILLA_HOME
npm install
```

All done!
Now you can use grunt tasks for development.

```bash
grunt compile
```


### Available Grunt Tasks

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `grunt test`       | Runs unit tests                            |
| `grunt combine`    | Generates an uncompressed JS file          |
| `grunt sass:theme` | Translates theme SCSS files into CSS files |
| `grunt document`   | Generates files for documents              |
| `grunt compile`    | Compiles JS files                          |
| `grunt package`    | Generates a package archive                |
