var mysql = require("mysql");


var io = require('socket.io').listen(3002);
// var elasticsearch = require('elasticsearch');


// Connect to localhost:9200 and use the default settings
// var client = new elasticsearch.Client();

// Connect the client to one node
/*var client = elasticsearch.Client({
  host: 'localhost:9200'
});*/

// Connect to this host using https, basic auth,
// a path prefix, and static query string values
/*var client = new elasticsearch.Client({
  host: 'http://localhost:9200',
  log: 'trace'
});*/

/*client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});*/
var socketCount = 0;

io.sockets.on('connection', function(socket) {
  // Socket has connected, increase socket count
  socketCount++;
  // Let all sockets know how many are connected
  io.sockets.emit('users connected', socketCount);

  socket.on('disconnect', function () {
    // Decrease the socket count on a disconnect, emit
    socketCount--;
    io.sockets.emit('users connected', socketCount)
  });
});
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes = function(router,connection,md5) {
    var self = this;
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    });

    router.get("/wishes",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["wishes"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "wishes" : rows});
            }
        });
    });

    router.post("/login",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=? and ??=?";
        var table = ["user_login","user_email",req.body.email, "user_password", md5(req.body.password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "User" : rows});
            }
        });
    });

    router.post("/new_user",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["user_login","user_email","user_password",req.body.email,md5(req.body.password)];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });

  router.post("/new_wish",function(req,res){
    var query = "INSERT INTO ??(??) VALUES (?)";
    var table = ["wishes", "wish", req.body.wish];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
      if(err) {
        res.json({"Error" : true, "Message" : "Error executing MySQL query: "+err});
      } else {
        res.json({"Error" : false, "Message" : "Wish Added !", "wish" : rows});
        io.sockets.emit('new wish', {'wish': req.body.wish, 'id': rows.insertId});
      }
    });
  });

}

module.exports = REST_ROUTER;
