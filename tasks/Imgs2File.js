'use strict';
module.exports = function (grunt) {
    grunt.registerMultiTask('imgs2file', 'Collects image files in target folder and writes their content to destination file in Base64.', function () {
        grunt.log.warn('HELLO.');
        var options = this.options({
            punctuation: '.',
            separator: ', '
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
            src += options.punctuation;
            grunt.file.write(f.dest, src);
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });
};
//# sourceMappingURL=imgs2file.js.map