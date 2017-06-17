Local setup:
#install command-line tools globally if not done already
npm install -g typescript
npm install -g gulp
npm install -g nodemon

#install all packages of package.json
npm install 

#run tsc(type scrypt compiler). 
tsc -p . -m commonjs  
# Note - Notice -m commonjs to convert import statements to require. Refer - http://stackoverflow.com/questions/38711136/why-am-i-getting-unexpected-token-import-on-one-webpack-project-but-not-the-ot
#You can alos use -w as additional switch so that it compiles in a loop watching for changes

#run gulp.  You can also add additional parameter "watch" to keep watching for files
gulp build

#run app.  
cd vizlinks/dist/server
node app.js

#you can also use nodemon to monitor changes to files and restart server immediately (for dev purposes). Adding a delay of 5 seconds as we want nodemon to wait till all files are copied over by gulp
nodemon --delay 5 app.js