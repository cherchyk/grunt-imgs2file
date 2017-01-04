'use strict';
const fs = require("fs");
const _ = require("lodash");
const IMG_TYPES = [
    { ext: 'png', mime: 'image/png' },
    { ext: 'jpg', mime: 'image/jpg' },
    { ext: 'gif', mime: 'image/gif' }
];
const PATH_SEP = '/';
function getFileInfo(name, src, pathPrefix) {
    var imgType = _.find(IMG_TYPES, (it) => {
        return _.endsWith(name.toLowerCase(), it.ext);
    });
    if (!imgType) {
        return null;
    }
    return {
        mime: imgType.mime,
        src: src,
        assetPath: pathPrefix ? pathPrefix + name : src
    };
}
function getImages(arrSrc, pathPrefix) {
    var result = [];
    _.each(arrSrc, (src) => {
        var stats = fs.statSync(src);
        if (stats.size == 0) {
            return;
        }
        var name = _.find(_.reverse(_.split(src, PATH_SEP)), (str) => str != null && str != "");
        if (stats.isFile()) {
            let fi = getFileInfo(name, src, pathPrefix);
            if (fi) {
                result.push(fi);
            }
            return;
        }
        if (stats.isDirectory()) {
            let newPathPrefix = pathPrefix ? pathPrefix + name + PATH_SEP : null;
            let res = fs.readdirSync(src);
            let newarrSrc = _.map(res, (fName) => {
                return src + PATH_SEP + fName;
            });
            let dirResult = getImages(newarrSrc, newPathPrefix);
            result = result.concat(dirResult);
            return;
        }
    });
    return result;
}
function doGruntJob(grunt) {
    grunt.registerMultiTask('imgs2file', 'Collects image files in target folder and writes their content to destination file in Base64.', function () {
        var options = this.options({
            separator: '|',
            path_prefix: null,
            assets_file: false
        });
        grunt.log.warn('this:::');
        grunt.log.ok(JSON.stringify(this));
        grunt.log.warn('options:::');
        grunt.log.ok(JSON.stringify(options));
        this.files.forEach(function (f) {
            let src = f.src
                .filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                else {
                    return true;
                }
            });
            let fileInfos = getImages(src, options.path_prefix);
            grunt.log.ok(JSON.stringify(src));
            grunt.log.ok(JSON.stringify(fileInfos));
            grunt.file.defaultEncoding = 'base64';
            let fMain = '';
            let fAssets = '';
            _.each(fileInfos, (file, index) => {
                if (index > 0) {
                    fMain += options.separator;
                    fAssets += options.separator;
                    ;
                }
                let content = grunt.file.read(file.src);
                let toSave = `${file.assetPath}${options.separator}data:${file.mime};base64,${content}`;
                fMain += toSave;
                fAssets += file.assetPath;
                grunt.log.writeln(toSave);
                grunt.log.writeln(file.assetPath);
            });
            grunt.file.write(f.dest, fMain, { encoding: 'utf8' });
            if (options.assets_file === true) {
                grunt.file.write(f.dest + '.assets', fAssets, { encoding: 'utf8' });
            }
            else {
                grunt.file.delete(f.dest + '.assets');
            }
        });
    });
}
module.exports = doGruntJob;
//# sourceMappingURL=imgs2file.js.map