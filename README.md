# gulp-closure-compiler2

Gulp plugin for google closure compiler
> Gulp plugin for Google Closure Compiler

*Issues with the output or Java should be reported on the Closure Compiler [issue tracker](https://github.com/google/closure-compiler/issues).*


This plugin is a refactored version of [gulp-closure-compiler](https://www.npmjs.com/package/gulp-closure-compiler).

## Install

```
npm install --save-dev gulp-closure-compiler2
```

## Example

### Simple optimizations

Simple optimizations for classic minifying.

```js
const gulp = require('gulp');
const closureCompiler = require('gulp-closure-compiler2');

gulp.task('default', function() {
  return gulp.src('src/*.js')
    .pipe(closureCompiler({
      fileName: 'build.js'
    }))
    .pipe(gulp.dest('dist'));
});
```

### Advanced optimizations

Advanced optimizations is much more aggressive. It's aimed for libraries like [Closure Library](https://developers.google.com/closure/library/).

```js
const gulp = require('gulp');
const closureCompiler = require('gulp-closure-compiler2');

gulp.task('default', function() {
  return gulp.src('src/*.js')
    .pipe(closureCompiler({
      fileName: 'build.js',
      compilerFlags: {
        closure_entry_point: 'app.main',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        define: [
          "goog.DEBUG=false"
        ],
        externs: [
          'node_modules/este-library/externs/react.js'
        ],
        extra_annotation_name: 'jsx',
        only_closure_dependencies: true,
        // .call is super important, otherwise Closure Library will not work in strict mode.
        output_wrapper: '(function(){%output%}).call(window);',
        warning_level: 'VERBOSE'
      }
    }))
    .pipe(gulp.dest('dist'));
});
```

### Compiling with Google Closure Library

The current version of the compiler doesn't need a deps file as it used to. Now you need to supply the directories where your dependencies are defined (via goog.provide).

```js
const gulp = require('gulp');
const closureCompiler = require('gulp-closure-compiler2');

gulp.task('default', function() {
  return gulp.src(['main.js', 'src/**/*.js', 'bower_components/closure-library/closure/goog/**/*.js'])
    .pipe(closureCompiler({
      fileName: 'build.js',
      compilerFlags: {
        closure_entry_point: 'app.main',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        only_closure_dependencies: true,
        warning_level: 'VERBOSE'
      }
    }))
    .pipe(gulp.dest('dist'));
});
```

## API

### closureCompiler(options)

#### options

##### fileName

Type: `string`  
Required

Generated file name. For example: `./dist/index.js`

##### compilerFlags

Type: `object`  

Closure compiler [flags](https://github.com/google/closure-compiler/wiki/Flags-and-Options).

##### maxBuffer

Type: `number` 

If the buffer returned by closure compiler is more than 1000kb, you will get an error saying "maxBuffer exceeded". To prevent this, you can set the maxBuffer to the preferred size you want (in kb).

##### continueWithWarnings

Type: `boolean` 

Ignore the warnings and continue with the compiler. This adds flexibility to some projects that can't work around certain warnings. Default value is `false``.

## How to download [Closure Compiler](https://developers.google.com/closure/compiler/)

Install the compiler to your project via npm:

`npm i -D google-closure-compiler`

## Implementation notes

- Vinyl stream is not supported.

## License

MIT © [Artem Shinkaruk](https://github.com/shining-mind)