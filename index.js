// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");

// Create a page-mod
// It will run a script whenever a "github" URL is loaded
pageMod.PageMod({
  include: "https://github.com/*",
  contentScriptFile: self.data.url("injected.js")
});
