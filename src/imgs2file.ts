/*
 * grunt-imgs2file
 * https://github.com/cherchyk/grunt-imgs2file
 *
 * Copyright (c) 2017 Bohdan Cherchyk
 * Licensed under the MIT license.
 */

'use strict';



import * as fs from 'fs';
import { WriteStream } from 'fs';

import * as _ from 'lodash';

interface ImgType {
	mime: string;
	ext: string;
}

const IMG_TYPES: Array<ImgType> = [
	{ ext: 'png', mime: 'image/png' },
	{ ext: 'jpg', mime: 'image/jpg' },
	{ ext: 'gif', mime: 'image/gif' }];
const PATH_SEP = '/';
//const ASSET_SEP = '|';

interface Options {
	separator: string;
	path_prefix: string;
	assets_file: boolean;
}

interface FileInfo {
	mime: string;
	assetPath: string;
	src: string;
}
//http://stackoverflow.com/questions/8110294/nodejs-base64-image-encoding-decoding-not-quite-working

function getFileInfo(name: string, src: string, pathPrefix: string): FileInfo {
	var imgType: ImgType = _.find(IMG_TYPES, (it: ImgType) => {
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

function getImages(arrSrc: Array<string>, pathPrefix: string): Array<FileInfo> {
	var result: Array<FileInfo> = [];

	_.each(arrSrc, (src: string) => {

		var stats = fs.statSync(src);

		if (stats.size == 0) {
			return;
		}

		var name = _.find(
			_.reverse(
				_.split(src, PATH_SEP)),
			(str) => str != null && str != "");

		if (stats.isFile()) {
			let fi: FileInfo = getFileInfo(name, src, pathPrefix);
			if (fi) {
				result.push(fi);
			}
			return;
		}

		if (stats.isDirectory()) {
			let newPathPrefix: string = pathPrefix ? pathPrefix + name + PATH_SEP : null;

			//var dirResult: Array<FileInfo> = getImages(src, newPathPrefix);
			//result = result.concat(dirResult);

			let res = fs.readdirSync(src);
			let newarrSrc: Array<string> = _.map(res, (fName: string) => {
				return src + PATH_SEP + fName;
			});

			let dirResult: Array<FileInfo> = getImages(newarrSrc, newPathPrefix);
			result = result.concat(dirResult);

			return;
		}
	});

	return result;
}



function doGruntJob(grunt: IGrunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('imgs2file', 'Collects image files in target folder and writes their content to destination file in Base64.', function () {

		// Merge task-specific and/or target-specific options with these defaults.
		var options: Options = this.options({
			separator: '|',
			path_prefix: null,
			assets_file: false
		});


		grunt.log.warn('this:::');
		grunt.log.ok(JSON.stringify(this));

		grunt.log.warn('options:::');
		grunt.log.ok(JSON.stringify(options));

		// Iterate over all specified file groups.
		// this.files.forEach(function (f: any) {
		// 	// Concat specified files.
		// 	var src = f.src
		// 		.filter(function (filepath: any) {
		// 			// Warn on and remove invalid source files (if nonull was set).
		// 			if (!grunt.file.exists(filepath)) {
		// 				grunt.log.warn('Source file "' + filepath + '" not found.');
		// 				return false;
		// 			}
		// 			else {
		// 				return true;
		// 			}
		// 		})
		// 		.map(function (filepath: any) {
		// 			// Read file source.
		// 			return grunt.file.read(filepath);
		// 		})
		// 		.join(grunt.util.normalizelf(options.separator));

		// 	// Handle options.
		// 	src += '.';

		// 	// Write the destination file.
		// 	grunt.file.write(f.dest, src);

		// 	// Print a success message.
		// 	grunt.log.writeln('File "' + f.dest + '" created.');
		// });


		this.files.forEach(function (f: any) {
			// Concat specified files.
			let src: Array<string> = f.src
				.filter(function (filepath: any) {
					// Warn on and remove invalid source files (if nonull was set).
					if (!grunt.file.exists(filepath)) {
						grunt.log.warn('Source file "' + filepath + '" not found.');
						return false;
					}
					else {
						return true;
					}
				});

			let fileInfos: Array<FileInfo> = getImages(src, options.path_prefix);

			// Print a success message.
			grunt.log.ok(JSON.stringify(src));
			grunt.log.ok(JSON.stringify(fileInfos));



			// let writeStreamMain: WriteStream = fs.createWriteStream(f.dest, {
			// 	flags: 'w',
			// 	encoding: 'utf8',
			// 	fd: null,
			// 	mode: 0o666,
			// 	autoClose: true,
			// });
			// let writeStream: WriteStream = fs.createWriteStream(f.dest + '.assets', {
			// 	flags: 'w',
			// 	encoding: 'utf8',
			// 	fd: null,
			// 	mode: 0o666,
			// 	autoClose: true,
			// });

			grunt.file.defaultEncoding = 'base64';

			let fMain: string = '';
			let fAssets: string = '';

			_.each(fileInfos, (file: FileInfo, index: number) => {
				if (index > 0) {
					fMain += options.separator;
					fAssets += options.separator;;
				}

				//let content: string = fs.readFileSync(file.src, 'base64');
				let content: string = grunt.file.read(file.src);

				let toSave = `${file.assetPath}${options.separator}data:${file.mime};base64,${content}`;

				// writeStreamMain.write(toSave);
				// writeStream.write(file.assetPath);
				fMain += toSave;
				fAssets += file.assetPath;

				grunt.log.writeln(toSave);
				grunt.log.writeln(file.assetPath);

			});
			// writeStreamMain.end();
			// writeStream.end();
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


export = doGruntJob;
