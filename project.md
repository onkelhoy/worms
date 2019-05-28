# Worms Project

### Table of contents
#### Setup
- [Setup](#Setup)
- [Server Setup](#Server-Setup)
- [Client Setup](#Client-Setup)
#### Game
- [Game](#Starting-With-The-Game)


### Setup
How the whole project was setup, both the server and client side. Of course most focus will be on server as it's basically a pile of setup.. :I

#### Server Setup
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

As a goal for this server setup was to use webpack to bundle all the client code & use es6 + sass (or actually scss in this case). With webpack comes *webpack-dev-server*, as we already have are own server we can use webpack as a middleware that functios the same as dev-server. But this is only when we work on the actual project, later when its done we should have the files already *"pre-bundled"* aka on production.

We must now setup a clear difference between dev & prod (development and production). 
##### Production
In production we want to write the bundle files to our `public` folder (and inside the `js` that serves all the javascript [which in this case will only be our bundles and some future libraries]). 

##### Development
In dev we configure the "devServer" which needs a `publicPath` (stated by the folks at webpack-dev-middleware *"its best to use the same publicPath as in the output!"*). We also setup the hot module for ease of coding (we love hot stuff!). As we are so keen on hot reload we also use nodemon for the server automatically reload (not hot but handy enough!).

#### Client Setup



### Starting With The Game