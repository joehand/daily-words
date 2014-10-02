require(['jquery', 'spec/index', 'boot'], function($, index, boot) {
    // Load the specs
    require(index.specs, function () {
      // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
      window.onload();
    });
});
