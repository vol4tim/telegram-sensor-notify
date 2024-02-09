# Telegram bot

## Setup

  You need to clone the repository.

  ```bash
  $ git clone https://github.com/vol4tim/telegram-sensor-notify.git
  ```

  Create configuration files.

  ```bash
  $ cp config.example.json config.json
  ```

  You need to add the telegram bot token in the `config.json` configuration file.

  Install requirements.

  ```bash
  $ yarn install
  ```

## Building

  ```bash
  $ yarn build
  ```

## Run server

  ```bash
  $ node dist/index.js
  ```

## Run cron service

  ```bash
  $ node dist/service.js
  ```
