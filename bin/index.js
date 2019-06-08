#!/usr/bin/env node
"use strict";

const program = require('commander')
const encrypt = require('../lib/encrypt')

program
  .command('encrypt')
  .alias('e')
  .description('Command to encrypt secret')

  .action(() => {
    encrypt()
  })

  program.parse(process.argv);
