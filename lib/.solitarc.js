const path = require('path');
const programDir = path.join(__dirname, '..', 'program/programs/agreement');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
  idlGenerator: 'anchor',
  programName: 'agreement',
  programId: 'AzST5p5ATAN1ABdwWXzV7Z8667b3qqA1JUz9w7eWE6Dt',
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};
