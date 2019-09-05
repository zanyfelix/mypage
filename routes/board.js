var express = require('express');
var router = express.Router();
var pg = require("pg")
var connectionString = "postgres://pkh:pkh@localhost:5432/study";
var client = new pg.Client(connectionString);
client.connect();

router.get('/', function(req, res, next) {
    res.redirect('/board/list');        
});

router.get('/list', function(req, res, next) {
    
    var sql = "SELECT brdno, brdtitle, brdwriter, brdcontent, brddate FROM BOARD";
    client.query(sql, function  (err, result) {
        if(err) {
            console.log("err : " + err);
        }
        res.render('board/list', {rows: result? result.rows:{}});        
    });

});    
//     client.connect();
//     client.query('select now()', (err,res) => {
//         console.log(err, res)
//         client.end();
//     })
    // pg.connect(connectionString, function(err, client) {       
    //     var query = client.query('select * from board');
    //     var rows = [];
    //     query.on('row', (row) => {
    //         rows.push(row);
    //     });
    //     query.on('end', function(row,err) {
    //         res.render('board', { title: 'Express'});
    //     });
    // });
// });
module.exports = router;