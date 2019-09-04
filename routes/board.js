var express = require('express');
var router = express.Router();
var pg = require("pg")
var connectionString = "postgres://pkh:pkh@localhost:5432/study";
var client = new pg.Client(connectionString);
client.connect();

router.get('/', function(req, res, next) {
    res.render('board', { title: 'Express' });
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