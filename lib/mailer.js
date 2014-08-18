/*
 * periodic
 * http://github.com/typesettin/periodic
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */


'use strict';

var path = require('path'),
		fs = require('fs-extra'),
		nodemailer = require('nodemailer'),
	  Extensions = require('periodicjs.core.extensions'),
		CoreExtension = new Extensions();

/**
 * A module that represents a extension manager.
 * @{@link https://github.com/typesettin/periodic}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @module config
 * @requires module:fs
 * @requires module:util-extent
 * @throws {Error} If missing configuration files
 * @todo to do later
 */

exports.getTransport = function(options,callback){
	var transportJsonFile = path.resolve( CoreExtension.extFunctions.getconfigdir({extname:'periodicjs.ext.mailer'}),'./transport.json'),
			transportObject = {
				transportType : 'direct',
				transportOptions : {debug:true}
			},
		appenvironment = options.environment;

	fs.readJson(transportJsonFile, function(err, transportJSON) {
		if(err){
			callback(err,null);
		}
		else{

			if(transportJSON[appenvironment]){
				transportObject = transportJSON[appenvironment];
					callback(null,nodemailer.createTransport(transportObject.type,transportObject.transportoptions));
			}
			else{
				callback(new Error('Invalid transport configuration, no transport for env: '+appenvironment),null);
			}
		}
	});
};