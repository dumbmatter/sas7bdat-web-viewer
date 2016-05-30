rm -rf build
mkdir build
cp src/index.html build
cp -r src/css build/css
NODE_ENV=production browserify src/app.js > build/app.js
NODE_ENV=production browserify src/worker.js > build/worker.js
