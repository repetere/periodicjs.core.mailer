# periodicjs.core.mailer

Periodic's Code mailer module exports a single function that asynchronously returns a node mailer transport to send transactional emails with.

 [API Documentation](https://github.com/typesettin/periodicjs.core.mailer/blob/master/doc/api.md)

## Installation

```
$ npm install periodicjs.core.mailer
```

This is a part of Periodic's core.

## Usage

### Sending Emails
*JavaScript*
```javascript
var CoreMailer = require('periodicjs.core.mailer'),
	sampleemail ={
		to: "user@example.com",
		cc: "service@example.com",
		subject: "sample email test",
		generateTextFromHTML: true,
		html: "<h1>Welcome User</h1><p>email rocks</p>"
	},
	emailtransport;

	CoreMailer.getTransport({
		appenvironment: 'development'
	}, function (err, transport) {
		if (err) {
			console.error(err);
		}
		else {
			emailtransport = transport;
			emailtransport.sendMail(sampleemail,function(err,result){console.log("err",err,"result",result)})
		}
	});
```


## API

```javascript
CoreMailer.getTransport(options,callback); //callback(err,nodemailertransport);
```
## Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt watch
```
$ grunt watch
```
For generating documentation
```
$ grunt doc
$ jsdoc2md lib/**/*.js > doc/api.md
```

## Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation