module.exports = function(app){
  var path = require('path');
  app.get("/", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/index.html"));
  });

  app.get("/toolsApp", function(req, res){
    res.sendFile(path.resolve(__dirname, "../../client/tools.html"));
  });
}
