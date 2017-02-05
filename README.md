# grunt-imgs2file

> Collects image files in target folder and writes their content to destination file in Base64.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-imgs2file --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-imgs2file');
```

## The "imgs2file" task

### Overview
In your project's Gruntfile, add a section named `imgs2file` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  imgs2file: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `'|'`

A string value that is used as a separator in file.

#### options.path_prefix
Type: `String`
Default value: `null`

A string value that is used as a prefix to file path.

#### options.assets_file
Type: `boolean`
Default value: `false`

If `true` then a new file will be generated just with file paths.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  imgs2file: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  imgs2file: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },

  imgs2file: {
    options: {},
	pngonly: {
      src: ['src/imgs/*.png'],
      dest: 'build/img/pngonly.txt'
	},
	folderonly: {
      src: ['src/imgs/'],
	  dest: 'tmp11/folderonly.txt',
	  options: {
        path_prefix: "asset/",
		assets_file: true
      },
	},
	folderstar: {
      src: ['src/imgs/*'],
	  dest: 'tmp11/folderstar.txt',
	  options: {
        "path_prefix": "abc/"
	  },
		}
	}


});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
