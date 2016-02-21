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

### Options

These task doesn't have any options. Everything is configured in the `files` property of the targets. The `files` property must use the "files array format" (not the "compact format" nor the "files object format") - see http://gruntjs.com/configuring-tasks#files-array-format

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

