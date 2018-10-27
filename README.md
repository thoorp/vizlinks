
Instructions:

Install command-line tools globally if not done already.

  `npm install -g typescript`
  
  `npm install -g gulp`
  
  `npm install -g nodemon`
  

Run tsc (type script compiler).

` tsc -p . -m commonjs`

Notice -m commonjs to convert import statements to require. Refer - http://stackoverflow.com/questions/38711136/why-am-i-getting-unexpected-token-import-on-one-webpack-project-but-not-the-ot

Build app.

`  gulp build`

Run app.

`cd vizlinks/dist/server node app.js`  

Open Browser.

http://localhost:5000/vizlinks
