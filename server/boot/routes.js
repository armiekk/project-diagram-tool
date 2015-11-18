module.exports = function(app){
  var path = require('path');
  var loopback = require('loopback');
  var bodyParser = require('body-parser');
  var jsonfile = require('jsonfile');

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

  app.get("/toolsApp*", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });

  app.get("/export", function(req, res){
    var file = "/home/armst0910/work/project-diagram-tool/server/storage/json/temp.json";
    // jsonfile.writeFile(file, req.query.diagramDetail, function (err) {
    //   if(err) console.error("write JSON", err);
    // });
    res.download(file);
  });

}
