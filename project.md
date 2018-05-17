# Worms Project

### Table of contents
[Setup](#Setup)
[Server Setup](#Server-Setup)
[Client Setup](#Client-Setup)
[Game](#Starting-With-The-Game)

# Setup
How the whole project was setup, both the server and client side. Of course most focus will be on server as it's basically a pile of setup.. :I

## Server Setup
Setting up the server.. 
The server runs on http, uses express as a framework and webpack-dev-middleware to connect *"webpack-dev-server"* with the our actual server. I call it *"webpack-dev-server"* only because I don't really know what else to call it.. It works the same (on a brief explenation point). 

With the server we have a bunch of **variables** to set, we do this in the *.env* file and use the module *dotenv* to simply require them see code below.
```javascript
const dotenv = require('dotenv')
dotenv.config()
```

As I wanted clear code I seperated config to actual server stuff i.e. routing etc. And this you should do at all time of course! So the structure of the project is as follows:
```
.
+-- config
|   +-- server.config.js
|   +-- webpack.dev.js
|   +-- webpack.prod.js
+-- public
|   +-- js
|   +-- humans.txt
+-- routes
|   +-- index.js
|   +-- ...
+-- src
|   +-- ...
+-- views
|   +-- game
|   +-- menu
+-- .env
+-- .gitignore  
+-- package.json
+-- project.md
+-- README.md
+-- server.js
+-- webpack.config.js
```

### Production

### Development


## Client Setup



# Starting With The Game