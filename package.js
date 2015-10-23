Package.describe({
  name: 'gevou:timeselector',
  version: '1.0.0_2',
  // Brief, one-line summary of the package.
  summary: 'A time selector UI component for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/gevou/timeselector',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use(['blaze', 'templating', 'underscore', 'jquery'], 'client');

  api.use('reactive-var');
  api.imply('reactive-var');

  api.use('fourseven:scss@3.3.3_3');  
  api.imply('fourseven:scss');

  api.use('poetic:materialize-scss@1.3.5');
  api.imply('poetic:materialize-scss');

  api.use('momentjs:moment@2.10.6');
  api.imply('momentjs:moment');

  api.use('fortawesome:fontawesome@4.4.0');
  api.imply('fortawesome:fontawesome');

  api.addFiles('timeselector.scss','client');
  api.addFiles('timeselector.html','client');
  api.addFiles('timeselector.js','client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('gevou:timeselector');
  api.addFiles('timeselector-tests.js');
});
