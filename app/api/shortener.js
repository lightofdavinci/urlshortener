'use strict';

module.exports = function (app,db) {

//handle get
	app.route('/:url').get(function (req, res) {
			var url = process.env.APP_URL + req.params.url;
			if(url != process.env.APP_URL + 'favicon.ico'){
				findUrl(res,db,url);
			}
		});
		
	function findUrl(res,db,url){
		db.collection('sites').findOne({"short_url":url}, function(err, result){
			if(err){throw err;}
			if(result){
				res.redirect(result.original_url);
			} else {
				res.send({"error":"there is no such a url in the database"});
			}
		});
	}	
	
// handle post		
	app.get('/new/:url*',function(req,res) {
		var toCheck = req.url.slice(5);
		if(validation(toCheck)){
			var objToSave = { "original_url": toCheck , "short_url": process.env.APP_URL + (Math.floor(Math.random()*7000)+1).toString()};
			res.send(objToSave);
			db.collection('sites').save(objToSave, function(err, result){
				if(err){throw err;}
				console.log("Added to 'sites' collection " + result);
			});
		} else {
			res.send({"error": "make sure you have valid url format"});
		}
	});	
	
	function validation(urlCh){
		return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(urlCh);
		//http://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url
	}
};
