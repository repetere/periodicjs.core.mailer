/*
 * periodic
 * http://github.com/typesettin/periodic
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */


'use strict';

var path = require('path'),
		fs = require('fs-extra'),
		htmlToText = require('nodemailer-html-to-text').htmlToText,
		ses = require('nodemailer-ses-transport'),
		sendmailTransport = require('nodemailer-sendmail-transport'),
		smtpPool = require('nodemailer-smtp-pool'),
		stubTransport = require('nodemailer-stub-transport'),
		sgTransport = require('nodemailer-sendgrid-transport'),
		mgTransport = require('nodemailer-mailgun-transport'),
		nodemailer = require('nodemailer');

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

exports.getTransport = function(options,callback){

	var transportJsonFile = path.resolve(process.cwd(),'content/config/extensions','periodicjs.ext.mailer','./transport.json'),
			transportObject = {
				transportType : 'direct',
				transportOptions : {debug:true}
			},
		nodemailerTransporter,
		appenvironment = options.appenvironment;

	fs.readJson(transportJsonFile, function(err, transportJSON) {
		if(err){
			callback(err,null);
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
				callback(null,nodemailerTransporter);
			}
			else{
				callback(new Error('Invalid transport configuration, no transport for env: '+appenvironment),null);
			}
		}
	});
};