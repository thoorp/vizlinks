Local setup:
#install typescript globally if not done already
npm install -g typescript
npm install -g gulp

#run tsc(type scrypt compiler). 
tsc -p . -m commonjs
# Note - Notice -m commonjs to convert import statements to require. Refer - http://stackoverflow.com/questions/38711136/why-am-i-getting-unexpected-token-import-on-one-webpack-project-but-not-the-ot

#run app
node app.js