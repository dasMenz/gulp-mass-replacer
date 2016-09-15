'use strict';
const trough = require('through2-concurrent');
const trough2 = require('through2');
const gutil = require('gulp-util');
const replace = require('gulp-replace');

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};

function codeObfuscator(replacmentList) {
	var stream = trough.obj( function( file, enc, cb ) {
		if( file.isNull() ){
			cb(new gutil.PluginError('gulp-code-obfuscator', 'No file given'));
			return;
		}
		if( file.isStream() ) {
			cb(new gutil.PluginError('gulp-code-obfuscator', 'Streaming not supported'), file);
			//return;
		}

		if( file.isBuffer() ) {
			//if (search instanceof RegExp) {

			file.contents = new Buffer(String(file.contents).replaceArray(["foobar", "lorem"], ["barfoo", "ipsum"]));
			//}
			//replace("foobar", "barfoo");
			//cb(new gutil.PluginError('gulp-code-obfuscator', 'Buffer not supported'), file);
			//return;
		}
		cb(null, file);
		// make sure the file goes through the next gulp plugin
		//this.push(file);

	}, cb => {
		gutil.log('gulp-code-obfuscator');
		cb();
	});
	return stream;
}

module.exports = codeObfuscator;