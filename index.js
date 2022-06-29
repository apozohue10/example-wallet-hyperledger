const config = require('./config.js');
const request = require('./lib/async_http.js');
const express = require('express');
const app = express();
const port = 3000

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.render('pages/index');
});


////////// CONNECTIONS //////////


app.get('/connections', (req, res) => {
	console.log('connections')
	res.render('pages/connections');
});

app.get('/list-connections', async (req, res) => {
	console.log('list-connections')
	try {
	    const list_connections = await request.httpAsync({
	        hostname: config.aries.host,
	        port: config.aries.port,
	        path: '/connections?state=completed', 
	        method: 'GET',
	        headers: {
				'Accept': 'application/json'
			}
	    });

	    console.log(list_connections);
	    res.render('pages/list-connections', {list_connections: list_connections.results});
	} catch (error) {
	    console.error(error);
	    res.send('fail');
	}
});

app.get('/input-invitation', (req, res) => {
	console.log('input-invitation')
	res.render('pages/input-invitation');
});

app.post('/input-invitation', async (req, res) => {
	console.log('POST input-invitation')
	try {
	    const invitation = await request.httpAsync({
	        hostname: config.aries.host,
	        port: config.aries.port,
	        path: '/out-of-band/receive-invitation',
	        method: 'POST',
	        headers: {
				'Content-Type': 'application/json'
			}
	    }, req.body['input-invitation']);

	    console.log(invitation);
	    res.render('pages/confirm-invitation', {invitation});
	} catch (error) {
	    console.error(error);
	    res.send('fail');
	}
});

app.get('/confirm-invitation', async (req, res) => {
	console.log('confirm-invitation')
	try {
		let connection_id = req.query.connection_id;

		let path = '/didexchange/' + connection_id + '/accept-invitation' 
	    const accept = await request.httpAsync({
	        hostname: config.aries.host,
	        port: config.aries.port,
	        path: path,
	        method: 'POST',
	        headers: {
				'Content-Type': 'application/json'
			}
	    });

	    console.log(accept)
	    res.redirect('/list-connections');
	} catch (error) {
	    console.error(error);
	    res.send('fail');
	}
});



////////// CREDENTIALS //////////

app.get('/credentials', async (req, res) => {
	console.log('credentials')
	try {
	    const list_credentials = await request.httpAsync({
	        hostname: config.aries.host,
	        port: config.aries.port,
	        path: '/issue-credential-2.0/records', 
	        method: 'GET',
	        headers: {
				'Accept': 'application/json'
			}
	    });

	    console.log(list_credentials);
		res.render('pages/credentials', {list_credentials: list_credentials.results});
	} catch (error) {
	    console.error(error);
	    res.send('fail');
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});