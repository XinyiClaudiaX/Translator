//Xinyi Xiao
//This file will implenment a server served as a translator, which reads users' requests about
//content and translation type from url and send back the translation of target language

const express = require('express');
const app = express();
const fs = require('fs');
const readline = require('readline');

const hostname = '127.0.0.1';
const port = 3000;

var e2s = genDic('Spanish.txt','leftToRight');
var e2g = genDic('German.txt','leftToRight');
var s2e = genDic('German.txt','rightToLeft');
var g2e = genDic('German.txt','rightToLeft');



//This is a function that transit the file contents into js objects.
//Parameter: "filename" and  "type". The "filename" is the file name of the foreign language 
//dictionary file. the "type" could be two values: "leftToRight" and "rightToLeft", which 
//demonstates how the mapping structure will be build, map from left word to right word, or
//vice versa.
//Return Value: The return value "diction" is an object match English to Spanish (or German).
//or vice versa.
function genDic(filename,type){
	//Get the file content.
	var file = fs.readFileSync(filename, 'latin1').split(/\r?\n/);
	file = file.filter(e => e[0] !== '#');
	file = file.map(e => e.split('\t'));
	file = file.filter(e => (e[0] !== undefined) && (e[1] !== undefined));
	file.map((e) => {var nonalpha = e[1].search(/[^A-Za-zÄÖÜäöüßÁÉÍÓÚÑáéíóúñ\s]/);
		if (nonalpha == -1){nonalpha = e[1].length + 1;}
		e[1] = e[1].slice(0,nonalpha);	
	});
	//Import the file content into a JS object
	var diction = {};
	for (let ele in file){
		if (type == 'leftToRight'){
			diction[file[ele][0].trim().toLowerCase()]= file[ele][1].trim().toLowerCase();
		} else if (type == 'rightToLeft'){
			diction[file[ele][1].trim().toLowerCase()]= file[ele][0].trim().toLowerCase();
		}
	}
	return diction;
}

//This is a function which is used to generate the translation according to users' 
//input sentences and the translation types they request.
//Parameter: "userArray" and "type". "userArray" is an array in which every element 
//is the single word in user's input in the source language. "type" is a string from 
//url that decides the source and target language so that proper dctionary object can be 
//used to generate the translation.
//Return Value: The return value is a string, which includes the translation of user's
//input in the target language.
function generateTrans(userArray,type){
	switch(type) {
		case 'english2spanish':
			userArray = userArray.map(word => e2s[word]);
			break;
		case 'english2german':
			userArray = userArray.map(word => e2g[word]);
			break;
		case 'spanish2english':
			userArray = userArray.map(word => s2e[word]);
			break;
		case 'german2english':
			userArray = userArray.map(word => g2e[word]);
			break;
		case 'spanish2german':
			userArray = userArray.map(word => s2e[word]);
			userArray = userArray.map(word => e2g[word]);
			break;
		case 'german2spanish':
			userArray = userArray.map(word => g2e[word]);
			userArray = userArray.map(word => e2s[word]);
			break;
	}
	return userArray.join(' ');
}

app.use(express.static('public_html'));
app.get('/translate/:type/:input',(req,res) => {
		console.log("hi");
		var type = req.params.type;
		var userArray = req.params.input.split(' ');
		if (req.params.input == ''){
			res.send('??');
		} else {
		res.send(generateTrans(userArray,type));
		}
});

app.listen(port,() => {
	console.log(`${port}`);
});
