const { flagsToArgs } = require('../lib');

describe('flagsToArgs', () => {
  it('should convert flags to compiler args correctly', () => {
    const args = flagsToArgs({
      "compilation_level": "ADVANCED",
      "use_types_for_optimization": null,
      "language_in": "ES5",
      "language_out": "ES5",
      "jscomp_off": [
        "nonStandardJsDocs"
      ],
      "jscomp_warning": [
        "invalidCasts",
        "accessControls",
        "checkDebuggerStatement",
        "checkRegExp",
        "checkTypes",
        "const",
        "constantProperty",
        "deprecated",
        "externsValidation",
        "missingProperties",
        "visibility",
        "missingReturn",
        "duplicate",
        "suspiciousCode",
        "uselessCode",
        "misplacedTypeAnnotation",
        "typeInvalidation"
      ]
    });

    expect(args).toEqual([
      '--compilation_level=ADVANCED',
      '--use_types_for_optimization',
      '--language_in=ES5',
      '--language_out=ES5',
      '--jscomp_off=nonStandardJsDocs',
      '--jscomp_warning=invalidCasts',
      '--jscomp_warning=accessControls',
      '--jscomp_warning=checkDebuggerStatement',
      '--jscomp_warning=checkRegExp',
      '--jscomp_warning=checkTypes',
      '--jscomp_warning=const',
      '--jscomp_warning=constantProperty',
      '--jscomp_warning=deprecated',
      '--jscomp_warning=externsValidation',
      '--jscomp_warning=missingProperties',
      '--jscomp_warning=visibility',
      '--jscomp_warning=missingReturn',
      '--jscomp_warning=duplicate',
      '--jscomp_warning=suspiciousCode',
      '--jscomp_warning=uselessCode',
      '--jscomp_warning=misplacedTypeAnnotation',
      '--jscomp_warning=typeInvalidation'
    ]);
  });

  it('should read externs using glob', () => {
    const args = flagsToArgs({
      "externs": [
        "./test/data/externs/!(es6)*.js",
        "./test/data/externs/es6.js"
      ]
    });

    expect(args).toEqual([
      '--externs=test/data/externs/shims.js',
      '--externs=test/data/externs/es6.js'
    ]);
  });
})