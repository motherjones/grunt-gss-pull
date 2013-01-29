# grunt-gss-pull

Pulls data from a published google spreadsheet and saves it as json locally.
Yes. Published. Not public, published.

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-gss-pull --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-gss-pull');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

## The "gss_pull" task

### Overview
In your project's Gruntfile, add a section named `gss_pull` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gss_pull: {
    your_target: {
        files: {
            'path/to/your.json' : ['google spreadsheet key']
        },
    },
  },
})
```

You should be able to then type `grunt gss_pull`, and grab the data out of the spreadsheet specified, and have it written as json.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History
_(Nothing yet)_
