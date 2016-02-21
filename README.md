# grunt-static-timestamp

> Add a timestamp to the static files, but only if they have actually changed

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-static-timestamp --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-static-timestamp');
```

Alternatively, you can automate the task loading with the [load-grunt-tasks](https://github.com/sindresorhus/load-grunt-tasks) task.

## The "static-timestamp" task

### Overview
In your project's Gruntfile, add a section named `static-timestamp` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    'static-timestamp': {
        your_target: {
        // Target-specific file lists and/or options go here.
        },
    },
});
```

The main idea of this task:

1) We should  have some other grunt task and/or tool that produce the "tentative build files" (or "temporary build files"). 

For instace, browserify or webpack could be called to produce the bundle file(s) of the application, or we could have the `concat -> uglify ->  compress` tasks already defined.

The paths to these temporary build files should be given in the `src` property (see the example below).

2) We give the directory where the temporary build files will be copied over (with a timestap prepended) in the `dest` property. This directory should be the one to be publicly exposed in the server.

3) The temporary build files given in `src` are compared with their counterparts from `dest` (using the md5 hash). If they don't match the task assumes that the file `src` is more recent, so it is copied to `dest` with the current timestamp prepended. The old file is deleted.

### Options

These task doesn't have any options. Everything is configured in the `files` property of the targets. See example below:

### Usage Examples

```js
grunt.initConfig({
    'static-timestamp': {
        myApp: {
            files: [{
                src: ['/path/to/build_files'], // can use globbing patterns
                dest: '/path/to/public_dir',
                filter: 'isFile'
            }]
        },

        myApp2: {
            files: [{
                src: ['/path/to/other/build_files'], 
                dest: '/path/to/public_dir', // doesn't have to be same
                filter: 'isFile'
            }]
        }
    },
});

```

Note that the `files` property must use the "files array format" (not the "compact format" nor the "files object format"). For more details see: http://gruntjs.com/configuring-tasks#files-array-format
