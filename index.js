
module.exports = function(robot) {
	robot.respond(/ping (.*)/i, function(msg,done) {
		site = msg.match[1];
		site = site.replace(/.*?:\/\//g,""); // to fix slack platfrom furling problem
		site = site.replace(/www./,"");  //accounting for all kinds of url patterns 
	robot.http("https://www."+site).get()(function(err, res, body) {
		try{
			if (err) {
				msg.send("Encountered an error " + err);
			}
			if (res.statusCode == 200) { //server side redirection doesn't work wo browser 
				msg.reply("Server is up!!").then(function(){
					msg.send("Open site?", done);
					robot.respond(/yes/i,function(msg,done){ //QnA script doesnt work
						window.open("https://www.google.com");
						msg.send("DONE",done);
					});
				});
			}
			else if (res.statusCode == 301 || res.statusCode == 302) { //redirection error code 
				msg.reply("Page Redirected; Error Code "+res.statusCode.toString(),done)
			} 
			else {
				msg.send("Request didn't come back HTTP 200 or 301:( HTTP Error Code: " + res.statusCode.toString() , done);
			}
		}
		catch(e) {
			msg.send(e.toString(),done);
		}
	});
	});
};

