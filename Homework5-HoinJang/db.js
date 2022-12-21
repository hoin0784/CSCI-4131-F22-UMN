var mysql = require("mysql");

var connPool = mysql.createPool({
    connectionLimit: 5,
    host: "cse-mysql-classes-01.cse.umn.edu",
    user: "C4131F22U45",
    database: "C4131F22U45",
    password: "quddkfl"
});

function addContact(Info){
    return new Promise((resolve,reject)=>{
        const SQL = 
        "insert into contactMe (postTitle,email,username,link,category,message) values (?, ?, ?, ?, ?, ?)";
        connPool.query(SQL, [Info.postTitle, Info.email, Info.username, Info.link, Info.category, Info.message],(err,rows)=>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    })
};

exports.addContact = addContact;

function getAllInfo(){
    return new Promise((resolve,reject)=>{
        const SQL = "select * from contactMe;";
        connPool.query(SQL,(err,rows)=>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    })
};

exports.getAllInfo = getAllInfo;

function getQuestionInfo(){
    return new Promise((resolve,reject)=>{
        const SQL = "select * from contactMe where category = 'Question';";
        connPool.query(SQL,(err,rows)=>{
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    })
};

exports.getQuestionInfo = getQuestionInfo;

function getConcernInfo() {
    return new Promise((resolve, reject) => {
        const SQL = "select * from contactMe where category = 'Concern';";
        connPool.query(SQL, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
};
exports.getConcernInfo = getConcernInfo;

function getCommentInfo() {
    return new Promise((resolve, reject) => {
        const SQL = "select * from contactMe where category = 'Comment';";
        connPool.query(SQL, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
};
exports.getCommentInfo = getCommentInfo;

