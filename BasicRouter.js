'use strict';
const http = require('http');
const url = require('url');
const qs = require('querystring');

let routes = {
	'GET': {
		'/': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>Hello Router</h1>');
		},
		'/about': (req, res) => {
			res.writeHead(200, {'Content-type': 'text/html'});
			res.end('<h1>This is the about page</h1>');
		},
		'api/getinfo': (req, res) => {
			res.writeHead(200, {'Content-type': 'application/json'});
			res.end(JSON.stringify(req.queryParams));
		}
	}, 
	'POST': {
		'/api/login': (req, res) => {
			let body = '';
			req.on('data', data => {
				body += data;
				if(body.length > 2097152) {
					res.writeHead(413, {'Content-type': 'text/html'});
					res.end('<h3>Error: File is too big</h3>');
					res.connection.destroy();
				}
			});
			req.on('end', () => {
				let params = qs.parse(body);
				console.log('Username: ', params['username']);
				console.log('Password: ', params['password']);
				res.end();
			});
		}
	},
	'NA': (req, res) => {
		res.writeHead(404);
		res.end('Content not found!');
	}
}

function router(req, res) {
	let baseUri = url.parse(req.url, true);
	let resolveRoute = routes[req.method][baseUri.pathname];
	if(resolveRoute != undefined){
		req.queryParams = baseUri.query;
		resolveRoute(req, res);
	} else {
		routes['NA'](req, res);
	}
 }

http.createServer(router).listen(3000, () => {
	console.log("Server running on port 3000");
});