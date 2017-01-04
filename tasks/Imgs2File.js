'use strict';
const fs = require("fs");
const _ = require("lodash");
const IMG_TYPES = [
    { ext: 'png', mime: 'image/png' },
    { ext: 'jpg', mime: 'image/jpg' },
    { ext: 'gif', mime: 'image/gif' }
];
const PATH_SEP = '/';
const ASSET_SEP = '|';
function recursivelyGetAllImages(dir, pathPrefix) {
    var result = [];
    var res = fs.readdirSync(dir);
    _.each(res, (fName) => {
        var fPath = dir + PATH_SEP + fName;
        var stats = fs.statSync(fPath);
        if (stats.size == 0) {
            return;
        }
        if (stats.isFile()) {
            var imgType = _.find(IMG_TYPES, (it) => {
                return _.endsWith(fName.toLowerCase(), it.ext);
            });
            if (!imgType) {
                return;
            }
            result.push({
                mime: imgType.mime,
                filePath: fPath,
                assetPath: pathPrefix + fName
            });
            return;
        }
        if (stats.isDirectory()) {
            var dirResult = recursivelyGetAllImages(fPath, pathPrefix + fName + PATH_SEP);
            result = result.concat(dirResult);
            return;
        }
    });
    return result;
}
function doGruntJob(grunt) {
    grunt.registerMultiTask('imgs2file', 'Collects image files in target folder and writes their content to destination file in Base64.', function () {
        grunt.log.warn('HELLO again.');
        grunt.log.ok(JSON.stringify(this.files));
        var options = this.options({
            separator: grunt.option('separator') ? grunt.option('separator') : '|',
            path_prefix: grunt.option('path_prefix') ? grunt.option('separator') : 'assets/'
        });
        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                else {
                    return true;
                }
            })
                .map(function (filepath) {
                return grunt.file.read(filepath);
            })
                .join(grunt.util.normalizelf(options.separator));
            src += '.';
            grunt.file.write(f.dest, src);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
}
module.exports = doGruntJob;
//# sourceMappingURL=imgs2file.js.map