var mysql = require("mysql");

var io = require('socket.io').listen(3002);

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
                res.json({"Error" : true, "Message" : "Error executing MySQL query " + err});
            } else {
                res.json({"Error" : false, "Message" : "User Added ! "+ res});
            }
        });
    });

  router.post("/new_wish",function(req,res){
    var query = "INSERT INTO ??(??, ??) VALUES (?, ?)";
    var table = ["wishes", "wish", "created_at", req.body.wish, new Date()];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
      if(err) {
        res.json({"Error" : true, "Message" : "Error executing MySQL query: " + err});
      } else {
        res.json({"Error" : false, "Message" : "Wish Added !", "wish" : rows});
        io.sockets.emit('new wish', {'wish': req.body.wish, 'id': rows.insertId, 'created_at': new Date()});
      }
    });
  });

}

module.exports = REST_ROUTER;
