exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['firstTest.js'],
  capabilities: {
          'browserName': 'firefox'
  }
};
