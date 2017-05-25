Local setup:
#install command-line tools globally if not done already
npm install -g typescript

npm install -g gulp

npm install -g nodemon


#run tsc(type scrypt compiler). 
tsc -p . -m commonjs
# Note - Notice -m commonjs to convert import statements to require. Refer - http://stackoverflow.com/questions/38711136/why-am-i-getting-unexpected-token-import-on-one-webpack-project-but-not-the-ot

#run gulp
gulp build

#run app
cd vizlinks/dist/server
node app.js