var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var dateFormat = require('dateformat');

router.get('/', function(req, res, next){
    res.redirect('boardList');
});

var config = {
    piKey: "AIzaSyBsTSUNZN8IXswVfMrqSad-gqKXtECNHbs",
    authDomain: "mypage-aa279.firebaseapp.com",
    databaseURL: "https://mypage-aa279.firebaseio.com",
    projectId: "mypage-aa279",
    storageBucket: "",
    messagingSenderId: "427877068630",
    appId: "1:427877068630:web:9b293bc3d355005f"
};
firebase.initializeApp(config);

router.get('/boardList', function(req, res, next) {
    firebase.database().ref('board').orderByKey().once('value', function(snapshot) {
        var rows = [];
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();         
            childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
            rows.push(childData);    
        });        
        res.render('board_firebase/boardList', {rows: rows});
    });
});
 
router.get('/boardRead', function(req, res, next) {
    firebase.database().ref('board/'+req.query.brdno).once('value', function(snapshot) {
        var childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
        res.render('board_firebase/boardRead', {row: childData});
    });
});
 
router.get('/boardForm', function(req,res,next){
    if (!req.query.brdno) {
        res.render('board_firebase/boardForm', {row: ""});
        return;
    }
 
    firebase.database().ref('board/'+req.query.brdno).once('value', function(snapshot) {
        var childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        res.render('board_firebase/boardForm', {row: childData});
    });
});
 
router.post('/boardSave', function(req,res,next){
    var postData = req.body;
    if (!postData.brdno) {
        postData.brdno = firebase.database().ref().child('posts').push().key;
        postData.brddate = Date.now();
    } else {
        postData.brddate = Number(postData.brddate);
    }
    console.log(req.body);
    firebase.database().ref('board/' + req.body.brdno).set({
        brdno : req.body.brdno,
        brdtitle : req.body.brdtitle,
        brdwriter : req.body.brdwriter,
        brdcontent : req.body.brdcontent,
        brddate : req.body.brddate
    });
    //var updates = {};
    //updates['/board/' + postData.brdno] = postData;
    //firebase.database().ref().update(updates);
     
    res.redirect('boardList');
});
 
router.get('/boardDelete', function(req,res,next){
    firebase.database().ref('board/' + req.query.brdno).remove();
    res.redirect('boardList');
});
 
module.exports = router;