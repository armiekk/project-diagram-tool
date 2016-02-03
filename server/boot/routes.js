/* global __dirname */
module.exports = function(app){
  var path = require('path');
  var loopback = require('loopback');
  var bodyParser = require('body-parser');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/js', loopback.static(__dirname + '../../../client/js'));
  app.use('/bower_components', loopback.static(__dirname + '../../../client/bower_components'));
  app.use('/css', loopback.static(__dirname + '../../../client/css'));
  app.use('/view', loopback.static(__dirname + '../../../client/view'));

  app.get("/", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });

  app.get("/register", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });

  app.get("/tools*", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });

  app.get("/login*", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });

}
