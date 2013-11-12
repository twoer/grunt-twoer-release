/*
 * grunt-twoer-release
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) 
{

    var fs = require('fs');
    var path = require('path');
    var log = grunt.log;

    grunt.registerMultiTask('release', '{%= description %}', function() 
    {
        var ignore = this.data.options.ignore;
        var ignoreRegex = null;

        this.files.every(function(files) 
        {
            _deleteFolder(files.dest);
            log.ok('folder ' + files.dest + ' is deleted.');

            var _srcs = files.src.filter(function(src)
            {
                var _result = true;
                ignore.every(function(regex) 
                {
                    ignoreRegex = new RegExp(regex);
                    if(ignoreRegex.test(src))
                    {
                        _result = false;
                    }
                    return true;
                });
                return _result
            });

            log.ok('all files size : ' + files.src.length);
            log.ok('after filter files size : ' + _srcs.length);

            _srcs.every(function(src)
            {
                var _srcCopy = src.replace(/\.\.\//g, '') ;
                grunt.file.copy(src, files.dest + _srcCopy); 
                log.ok('file: ' + src + ' copy to path: ' + path.resolve(files.dest + _srcCopy));
                return true;
            });
        });
    });


    var _deleteFolder = function(path) {
    var files = [];
    if( fs.existsSync(path) ) 
    {
        files = fs.readdirSync(path);
        files.forEach(function(file,index)
        {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) 
            { // recurse
                _deleteFolder(curPath);
            }
            else 
            { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

};
