# picturepaste

[![License](https://img.shields.io/github/license/JoeBiellik/picturepaste.svg)](LICENSE.md)
[![Release Version](https://img.shields.io/github/release/JoeBiellik/picturepaste.svg)](https://github.com/JoeBiellik/picturepaste/releases)
[![Dependencies](https://img.shields.io/david/JoeBiellik/picturepaste.svg)](https://david-dm.org/JoeBiellik/picturepaste)

> Simple [Node.js](https://nodejs.org/) image pastebin built with [Koa](https://koajs.com/), [MongoDB](https://www.mongodb.org/), [Pug](https://pugjs.org/) and [Bootstrap](https://getbootstrap.com/).

Try it out at [paste.pictures](https://paste.pictures/)

## Features

* Clean code thanks to ES7 async/await and [Koa](https://koajs.com/)
* Short URLs via [shortid](https://github.com/dylang/shortid), e.g. `NyQO9puMe`
* Full support for CLI requests with [curl](https://curl.haxx.se/) etc
* Automatic and configurable paste expiry
* Runs fully containerized with [Docker](https://www.docker.com/)
* Simple and responsive UI built with [Bootstrap](https://getbootstrap.com/)

## Development

1. Clone this repo:
  ```shell
  git clone https://github.com/JoeBiellik/picturepaste.git && cd picturepaste
  ```

2. Install dependencies:
  ```shell
  npm install
  ```

3. Start MongoDB:
  ```shell
  docker-compose up -d db
  ```

4. Start app and watch for changes:
  ```shell
  npm run watch
  ```

## Deployment

1. Configure `config/docker.json` with any custom settings

2. Start the production database and Node.js server:
  ```shell
  docker-compose up
  ```
