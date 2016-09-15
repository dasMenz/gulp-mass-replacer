'use strict';
const trough = require('through2-concurrent');
const gutil = require('gulp-util');

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
  	var string = find[i].concat("\\(");
    regex = new RegExp(string, "g");
    replaceString = replaceString.replace(regex, replace[i].concat("("));
  }
  return replaceString;
};

function codeObfuscator(replacmentList) {
	var stream = trough.obj( function( file, enc, cb ) {
		if( file.isNull() ){
			return cb(new gutil.PluginError('gulp-code-obfuscator', 'No file given'), file);
		}
		if( file.isStream() ) {
			return cb(new gutil.PluginError('gulp-code-obfuscator', 'Streaming not supported'), file);
		}

		if( file.isBuffer() ) {
			console.log(file.path);
			file.contents = new Buffer(String(file.contents).replaceArray(replacmentList[0], replacmentList[1]));
		}
		// make sure the file goes through the next gulp plugin
		this.push(file);
		cb(null, file);

	}, cb => {
		gutil.log('gulp-code-obfuscator');
		cb();
	});
	return stream;
}

module.exports = codeObfuscator;