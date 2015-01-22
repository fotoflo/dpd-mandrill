/**
 * Module dependencies
 */

var Resource        = require('deployd/lib/resource'),
    lodash          = require('lodash'),
    util            = require('util'),
    path            = require('path'),
    mandrill        = require('mandrill-api/mandrill');

/**
 * Module setup.
 */

function MandrillApi( options ) {

  Resource.apply( this, arguments );

  this.mandrill_client = new mandrill.Mandrill(this.config.api);
}

util.inherits( MandrillApi, Resource );

MandrillApi.prototype.clientGeneration = true;

MandrillApi.events = ["post"];
MandrillApi.label = 'Mandrill Send Template';
MandrillApi.defaultPath = '/mandrill';
MandrillApi.basicDashboard = {
  settings: [
  {
    name        : 'api',
    type        : 'text',
    description : 'API Key'
  }, {
    name        : 'defaultFromAddress',
    type        : 'text',
    description : 'Optional; if not provided you will need to provide a \'from_email\' address in every request'
  }, {
    name        : 'defaultFromName',
    type        : 'text',
    description : 'Optional; if not provided you will need to provide a \'from_name\' name in every request'
  }, {
    name        : 'defaultSubject',
    type        : 'text',
    description : 'Optional; if not provided you wil need to provide a \'subject\' in every request'
  }, {
    name        : 'defaultTemplate',
    type        : 'text',
    description : 'Optional; if not provided you wil need to provide a \'template_name\' in every request'
  }]
};

/**
 * Module methodes
 */

MandrillApi.prototype.handle = function ( ctx, next ) {

  if ( ctx.req && ctx.req.method !== 'POST' ) {
    return next();
  }

  if ( !ctx.req.internal && this.config.internalOnly ) {
    return ctx.done({ statusCode: 403, message: 'Forbidden' });
  }

  var self = this,
    parts = ctx.url.split('/').filter(function(p) { return p; }),
    result = {},
    domain = createDomain( ctx.body, {} );

  if(this.events.post) {
    this.events.post.run( ctx, domain, function( err ) {
      if( err ) return ctx.done( err );
      self.post( ctx, next );
    });
  }
};

MandrillApi.prototype.post = function( ctx, next ) {

  var options = ctx.body || {};

  var template_name = options.template_name || this.config.defaultTemplate;
  var template_content = options.template_content || [{
      name: "example name",
      content: "example content"
    }];
  var message = {
      subject: options.subject || this.config.defaultSubject,
      from_email: options.from_email || this.config.defaultFromAddress,
      from_name: options.from_name || this.config.defaultFromName,
      to: options.to || []
    };


  var request = {
    template_name: template_name,
    template_content: template_content,
    message: message
  }

  var errors = {};

  if ( !request.message.to ) {
    errors.to = '\'to\' is required';
  }
  if ( !request.message.from_email ) {
    errors.from = '\'from_email\' is required';
  }
  if ( !request.template_name ) {
    errors.template = '\'template_name\' is required';
  }

  if ( Object.keys(errors).length ) {
    return ctx.done({ statusCode: 400, errors: errors });
  }

  this.mandrill_client.messages.sendTemplate(request, function(result) {
    console.log(result);
    ctx.done( null, result);
  }, function(e) {
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    return ctx.done( e );
  });

};

function createDomain(data, errors) {
  var hasErrors = false;
  var domain = {
    error: function(key, val) {
      debug('error %s %s', key, val);
      errors[key] = val || true;
      hasErrors = true;
    },
    errorIf: function(condition, key, value) {
      if (condition) {
        domain.error(key, value);
      }
    },
    errorUnless: function(condition, key, value) {
      domain.errorIf(!condition, key, value);
    },
    hasErrors: function() {
      return hasErrors;
    },
    hide: function(property) {
      delete domain.data[property];
    },
    'this': data,
    data: data
  };
  return domain;
}

/**
 * Module export
 */

module.exports = MandrillApi;
