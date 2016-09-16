'use strict';
const trough = require('through2-concurrent');
const gutil = require('gulp-util');

String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
  	//var string = "(?<!(_|[a-zA-Z0-9]))";
  	var string = "(.|\s|)(";
  	// string = string.concat(find[i]);
  	string = string.concat( find[i].concat( ")(\\(|\'|\")"  ) );
    regex = new RegExp(string, "g");
    // replaceString = replaceString.replace(regex, replace[i].concat("("));
    replaceString = replaceString.replace(regex, function($0, $1, $2, $3){
    	/*console.log("$0"+$0);
    	console.log("$1"+$1.concat( replace[i].concat( "(" ) ));*/
    	if( ( $1 == " " || $1 == ">" || $1 == ":" || $1 == "\t" || $1 == "\n" || $1 == "" || $1 == "'" || $1 == "\"" ) && $2 != "" ) {
		/*console.log("$0 "+$0);
		console.log("$1 "+$1);
		console.log("$2 "+$2);
		console.log("$3 "+$3);*/
    		return $1.concat( replace[i].concat( $3 ) );
    	} else {
    		return $0;
    	}
    	/*var return_string = $0.concat(replace[i]);
    	return return_string.concat("(")*/
    });
  }
  return replaceString;
};

function codeObfuscator(replacmentList) {
	var stream = trough.obj( function( file, enc, cb ) {
		if( file.isNull() ){
			return cb(new gutil.PluginError('gulp-mass-replacer', 'No file given'), file);
		}
		if( file.isStream() ) {
			return cb(new gutil.PluginError('gulp-mass-replacer', 'Streaming not supported'), file);
		}

		if( file.isBuffer() ) {
			console.log(file.path);
			file.contents = new Buffer(String(file.contents).replaceArray(replacmentList[0], replacmentList[1]));
		}
		// make sure the file goes through the next gulp plugin
		this.push(file);
		cb(null, file);

	}, cb => {
		gutil.log('gulp-mass-replacer');
		cb();
	});
	return stream;
}

module.exports = codeObfuscator;
