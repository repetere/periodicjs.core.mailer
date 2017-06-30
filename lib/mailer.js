'use strict';
const getEmailTemplateHTMLString = require('./getEmailTemplateHTMLString');
const getTransport = require('./getTransport');
const sendEmail = require('./sendEmail');
const ejs = require('ejs');

/**
 * a mailer class for periodic that sends mail using nodemailer
 * 
 * @class Mailer
 */
class Mailer {
  /**
   * Creates an instance of Mailer.
   * @param {any} [options={}] 
   * 
   * @memberof Mailer
   */
  constructor(options = {}) {
    this.config = Object.assign({
      transportConfig: {
        type: 'stub',
        transportoptions: {
          debug: true,
          args: ['-t', '-i']
        }
      },
    }, options.config);
    this.transport = options.transport;
    this.getEmailTemplateHTMLString = getEmailTemplateHTMLString.bind(this);
    this.getTransport = getTransport.bind(this);
    this.sendEmail = sendEmail.bind(this);
    return this;
  }
  /**
   * reads a filepath and returns the email template string (will use EJS to render later by default)
   * 
   * @static
   * 
   * @memberof Mailer
   */
  static getEmailTemplateHTMLString(options) {
    getEmailTemplateHTMLString(options);
  }
  /**
   * returns a node mailer transport based off of a json configuration
   * 
   * @static
   * 
   * @memberof Mailer
   */
  static getTransport(options) {
    getTransport(options);
  }
  /**
   * sends email with nodemailer
   * 
   * @static
   * @param {any} [options={}] all of the options to a node mailer transport sendMail function
   * @param {object|string} options.to 
   * @param {object|string} options.cc
   * @param {object|string} options.bcc 
   * @param {object|string} options.replyto 
   * @param {object|string} options.subject 
   * @param {object|string} options.html 
   * @param {object|string} options.text 
   * @param {object|string} options.generateTextFromHTML 
   * @param {object|string} options.emailtemplatestring 
   * @param {object|string} options.emailtemplatedata 
   * @returns {promise} resolves the status of an email
   * 
   * @memberof Mailer
   */
  static sendEmail(options){
    sendEmail(options);
  }
}
module.exports = Mailer;