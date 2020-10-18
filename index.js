//const { Console } = require("console");
const express = require("express");
const app = express();
//const spawn = require("child_process").spawn;
const spawnSync = require("child_process").spawnSync;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if ('OPTIONS' == req.method) {
	   res.sendStatus(200);
	}
	else {
	   next();
	}
});	

app.get("/", (req, res, next) => {
	var input = req.query.input;
	var clusterData, posData;
	var reply = {};
	console.log("Input   :  " + input + "\n\n");
	
	const proPOS = spawnSync('python3', ["./postagger.py", input], { encoding : 'utf8' });
	posData = proPOS.output;

	const proCtr = spawnSync('python3', ["./cluster.py", input], { encoding : 'utf8' });
	clusterData = proCtr.output;
	
	reply["pos"] = posData;
	reply["cluster"] = clusterData;

	res.json(reply); 
});
 

app.listen(3000, () => {
 	console.log("Server running on port 3000");
});
