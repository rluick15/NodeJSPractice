'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.gif': 'text/gif',
	'.jpg': 'text/jpeg',
	'.png': 'text/png'
}

function webserver(req, res) {
	let baseURI = url.parse(req.url);
	let filepath = __dirname + (baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname);
	console.log(filepath);

	//check if file is available or not
	fs.access(filepath, fs.F_OK, error => {
		if(!error) {
			//no error
			fs.readFile(filepath, (error, content) => {
				if(!error) {
					//Resolve the content type
					let contentType = mimes[path.extname(filepath)];
					res.writeHead(200, {'Content-type': contentType});
					res.end(content, 'utf-8');
				} else {
					//Serve a 500
					res.writeHead(500);
					res.end('The server could not read the file requested!');
				}		
			});
		} else {
			//error Serve 404
			res.writeHead(404);
			res.end('Content not found!');
		}
	}); 
}

http.createServer(webserver).listen(3000, () => {
	console.log('Webserver running on port 3000');
});