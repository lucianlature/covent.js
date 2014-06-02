var Class = require("./Class").Class;

var Application = Class.create();

Application
  .defineMethod('initialize', function (config) {
    this._config = config;
  })
  .defineMethod('afterInitialize', function () {
    return this._config;
  });

exports.Application = Application;
