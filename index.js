const PORT = process.env.PORT || 5000
var http = require('http');
var express = require("express");
var RED = require("node-red");
  
// Create an Express app
var app = express();
  
// Add a simple route for static content served from 'static'
app.use("/",express.static("static"));
  
// Create a server
var server = http.createServer(app);

if (process.env.disableEditor == 'false'){
  var disableEditor = false
} else {
  var disableEditor = true
}
// Create the settings object 
var settings = {
    httpAdminRoot:"/admin",
    httpNodeRoot: "/",
    disableEditor: disableEditor,
    userDir:"./",
    flowFile: 'flows.json',
    credentialSecret: process.env.credentialSecret,
    functionGlobalContext: { },
    adminAuth: {
      type: "credentials",
      users: [{
            username: process.env.adminUser,
            password: bcrypt.hashSync(process.env.adminPassword, 8),
            permissions: "*"
          }]
    } 
}
console.log(settings)
  // Initialise the runtime with a server and settings
RED.init(server,settings);
  
// Serve the editor UI from /admin
app.use(settings.httpAdminRoot,RED.httpAdmin);
  
// Serve the http nodes UI from /
app.use(settings.httpNodeRoot,RED.httpNode);
  
server.listen(PORT);
  
// Start the runtime
RED.start();