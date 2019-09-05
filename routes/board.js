var express = require('express');
var router = express.Router();
var pg = require("pg")

var config = {
    host : 'localhost',
    user : 'pkh',
    database : 'study',
    password : 'pkh',
    port : 5432
}
var pool = new pg.Pool(config);

router.get('/', function(req, res, next) {
    res.redirect('/board/list');        
});

router.get('/list', function(req, res, next) {
    pool.connect(function(err, client, done) {
        if(err) {
            console.error("Error"+ err);
        }
        var sql = "SELECT brdno, brdtitle, brdwriter, brdcontent, to_char(brddate, 'YYYY-MM-DD') brddate FROM BOARD";
        client.query(sql, function(err, result) {            
            if(err) {
                console.error("Error"+ err);
            }
            res.render('board/list', {rows: result? result.rows:{}});  
            done();
        });
    });   
});

router.get('/read', function(req,res,next) {
    if(!req.query.brdno) {
        res.render('board/form', {row: ""})
        return;
    }
    pool.connect(function(err, client, done) {
        var sql = "SELECT brdno, brdtitle, brdcontent, brdwriter, to_char(brddate, 'YYYY-MM-DD') brddate FROM board WHERE brdno=" + req.query.brdno;
        client.query(sql, function(err, result){            
            if(err) {
                console.error("Error"+ err);
            }
            res.render('board/read', {result: result.rows[0]}); 
            done();
        });
    });    
});

router.get('/form', function(req,res,next) {    
    if(!req.query.brdno) {
        res.render('board/form', {result: ""})
        return;
    }
    pool.connect(function(err, client, done) {
        var sql = "SELECT brdno, brdtitle, brdcontent, brdwriter, to_char(brddate, 'YYYY-MM-DD') brddate FROM board WHERE brdno=" + req.query.brdno;
        client.query(sql, function(err, result){            
            if(err) {
                console.error("Error"+ err);
            }
            res.render('board/form', {result: result.rows[0]}); 
            done();
        });
    });    
});

router.post('/save', function(req,res,next) {            
    var data = [req.body.brdtitle, req.body.brdcontent, req.body.brdwriter];     
    pool.connect(function(err, client, done) {
        var sql = "";
        if(req.body.brdno) {
            sql = "UPDATE board SET brdtitle=($1), brdcontent=($2), brdwriter=($3) where brdno=($4)";
        } else {
            sql = "INSERT INTO board(brdtitle, brdcontent, brdwriter, brddate) values (($1),($2),($3), NOW())";
        }
        client.query(sql, data, function(err, result){           
            if(err) {
                console.error("Error"+ err);
            }
            res.redirect('list');
            done();
        });
    });    
});

router.get('/delete', function(req,res,next) {    
    pool.connect(function(err, client, done) {
        var sql = "DELETE FROM board where brdno="+req.query.brdno;
        client.query(sql, function(err, result){            
            if(err) {
                console.error("Error"+ err);
            }
            res.redirect('list');
            done();
        });
    });    
});
module.exports = router;