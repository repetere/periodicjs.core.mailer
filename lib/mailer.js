/*
 * periodic
 * http://github.com/typesettin/periodic
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */


'use strict';

var path = require('path'),
		fs = require('fs-extra'),
		async = require('async'),
		ejs = require('ejs'),
		htmlToText = require('nodemailer-html-to-text').htmlToText,
		ses = require('nodemailer-ses-transport'),
		sendmailTransport = require('nodemailer-sendmail-transport'),
		smtpPool = require('nodemailer-smtp-pool'),
		stubTransport = require('nodemailer-stub-transport'),
		sgTransport = require('nodemailer-sendgrid-transport'),
		mgTransport = require('nodemailer-mailgun-transport'),
		nodemailer = require('nodemailer'),
		mailtransport;

var getEmailTemplateHTMLString = function(options,callback){
	fs.readFile(options.emailtemplatefilepath, 'utf8', function (err, templatestring) {
		if (err) {
			callback(err,null);
		}
		else{
			callback(null,templatestring);
		}
	});
};

/**
 * sends email with nodemailer
 * @param  {object}   options nodemailer mail options: to,cc,bcc,replyTo,subject,html,text,generateTextFromHTML, emailtemplatestring, emailtemplatedata
 * @param  {Function} cb      async callback function
 * @return {Function}           async cb
 */
var sendEmail = function (options, cb) {
	var mailoptions = options;
	async.series({
		getEmailHTMLTemplate:function(asyncCB){
			if(mailoptions.html || mailoptions.emailtemplatestring){
				asyncCB(null, 'already have mail template or html');
			}
			else{
				getEmailTemplateHTMLString({
						emailtemplatefilepath:mailoptions.emailtemplatefilepath
					},function(err,templatestring){
						if(err){
							asyncCB(err,null);
						}
						else{
							mailoptions.emailtemplatestring = templatestring;
							asyncCB(null,'got template string');
						}
				});
			}
		},
		getEmailHTML:function(asyncCB){
			if(mailoptions.html){
				asyncCB(null, 'already supplied email html');
			}
			else{
				mailoptions.html = ejs.render(options.emailtemplatestring, options.emailtemplatedata);
				asyncCB(null, 'generated email html');
			}
		},
		getMailTransport:function(asyncCB){
			if(mailtransport){
				asyncCB(null, 'already initialized transport');
			}
			else if(!mailoptions.appenvironment){
				asyncCB(new Error('You need to supply an "appenvironment" as an option if you have not initialized CoreMailer with getTransport'),null);
			}
			else{
				getTransport(mailoptions,function(err,mt){
					if(err){
						cb(err,null);
					}
					else{
						mailtransport = mt;
						asyncCB(null, 'init transport');
					}
				});
			}
		}
	},function(err){
		if(err){
			cb(err,null);
		}
		else{
			mailtransport.sendMail(mailoptions, cb);
		}
	});
};

/**
 * A module that represents a extension manager.
 * @{@link https://github.com/typesettin/periodic}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports getTransport
 * @requires module:fs-extra
 * @requires module:nodemailer
 * @requires module:periodicjs.core.extensions
 * @requires module:path
 * @throws {Error} If missing transport configuration file from periodicjs.ext.mailer extension
 * @todo to do later
 */

var getTransport = function(options,callback){

	var transportJsonFile = path.resolve(process.cwd(),'content/config/extensions','periodicjs.ext.mailer','./transport.json'),
			transportObject = {
				transportType : 'direct',
				transportOptions : {debug:true}
			},
		nodemailerTransporter,
		appenvironment = options.appenvironment;

	fs.readJson(transportJsonFile, function(err, transportJSON) {
			// console.warn('err',err);
		if(err){
			console.warn(err);
			nodemailerTransporter = nodemailer.createTransport(transportObject.type,transportObject.transportoptions);					
			nodemailerTransporter.use('compile', htmlToText());
			callback(null,nodemailerTransporter);
		}
		else{

			if(transportJSON[appenvironment]){
				transportObject = transportJSON[appenvironment];

				if(transportObject.type === 'ses'){
					nodemailerTransporter = nodemailer.createTransport(ses(transportObject.transportoptions));
				}
				else if(transportObject.type === 'sendmail'){
					nodemailerTransporter = nodemailer.createTransport(sendmailTransport(transportObject.transportoptions));
				}
				else if(transportObject.type === 'smtp-pool'){
					nodemailerTransporter = nodemailer.createTransport(smtpPool(transportObject.transportoptions));
				}
				else if(transportObject.type === 'sendgrid'){
					nodemailerTransporter = nodemailer.createTransport(sgTransport(transportObject.transportoptions));
				}
				else if(transportObject.type === 'mailgun'){
					nodemailerTransporter = nodemailer.createTransport(mgTransport(transportObject.transportoptions));
				}
				else if(transportObject.type === 'stub'){
					nodemailerTransporter = nodemailer.createTransport(stubTransport(transportObject.transportoptions));
				}
				else{
					nodemailerTransporter = nodemailer.createTransport(transportObject.type,transportObject.transportoptions);					
				}

				nodemailerTransporter.use('compile', htmlToText());
				mailtransport = nodemailerTransporter;
				callback(null,nodemailerTransporter);
			}
			else{
				callback(new Error('Invalid transport configuration, no transport for env: '+appenvironment),null);
			}
		}
	});
};

exports.getTransport = getTransport;
exports.sendEmail = sendEmail;
exports.getEmailTemplateHTMLString = getEmailTemplateHTMLString;