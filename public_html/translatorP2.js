//Xinyi Xiao
//CSC337 PA7
//This js program read users' inputs, send AJAX requests to the server
//and render the return data from the server.

//Three global variables for keeping the user input.
var input = '';
var lang1 = 'english';
var lang2 = 'spanish';


//Event listeners
const userIn = document.getElementById('input');
userIn.addEventListener('input', (e) => {input = e.target.value; translation()});

const oriLang = document.querySelector('.language1');
oriLang.addEventListener('change', (e) => {lang1 = e.target.value; translation()});
	
const targetLang = document.querySelector('.language2');
targetLang.addEventListener('change', (e) => {lang2 = e.target.value; translation()});


function translation(){
	var XHR = new XMLHttpRequest();
	
	//Render the return data from the server to specific area of the webpage
	let translation = document.getElementById('translation');	
	XHR.onreadystatechange = () => {
		if (XHR.readyState  === XMLHttpRequest.DONE){
			if (XHR.status === 200){
				translation.textContent = XHR.responseText;
			} else { translation.textContent = '??';}
		}
	}

	//generate url and send the request
	var type = lang1 + '2' + lang2;

	if (input !== '' && lang1 !== lang2){
		let url = '/'+translate'/' + type + '/' + input;
		XHR.open('GET',url);
		XHR.send();
		} else if (lang1 == lang2){
			translation.textContent = input;
		} else {translation.textContent = '??';}
}			
