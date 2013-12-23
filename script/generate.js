var wrench = require('wrench'),
    util = require('util'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    async = require('async'),
    zip = require("node-native-zip"),
    fsExtra = require('fs-extra');
/*
 * Project generator route. 
 * This entire route is super brute force and rather naive. However, it works and is easy to follow. 
 * TODO: Possible improvements include doing more async calls with the fs module since this uses the async.js
 * lib it shouldn't be too bad to impelement. 
*/

if(process.argv.length != 4){
  console.log("usage: "+ process.argv[1]+ " appName packageName" );
  return;
}

console.log("App name: "+process.argv[2]);
console.log("Package name: "+process.argv[3]);

var myAppName = process.argv[2];
var myPackageName = process.argv[3];
main();

function main() {

    // 1. Create a temporary file(s) location. 
    // 2. Rename the directories accordingly. 
    // 3. Loop over all the files and perform replacements. 
    // 4. Zip up the content & Send to the output stream
    // 5. Delete the temporary file(s). 
    // 6. All Done - Do some 12 ounce curls. 

    console.log(process.env.PWD);

    var appName = myAppName;
    var packageName = myPackageName;

    console.log("App Name:" + appName);
    console.log("Package Name:" + packageName);

    // Android Bootstrap source directory
    var sourceDir = process.env.PWD + '/android-bootstrap';
    
    // Temporary locationwhere the users project will be generated.
    var tempDir = process.env.PWD + '/tmp/';
    var destDir = process.env.PWD + '/tmp/' + packageName; 

  if(fs.existsSync(tempDir)) {
  removeTemp(tempDir);
}
createTemp(tempDir);

    console.log("sourceDir: " + sourceDir);
    console.log("destDir: " + destDir); 

    // Copy the files to temp directory. 
    wrench.excludeHiddenUnix = true;
    wrench.copyDirSyncRecursive(sourceDir, destDir, {excludeHiddenUnix : true /* See sync version */});

    var theFiles = wrench.readdirSyncRecursive(destDir, {excludeHiddenUnix : true /* See sync version */});

    var callItems = [];

   
  fsExtra.copy(sourceDir + '/.gitignore', destDir + '/.gitignore', function(err){
   console.log("copying .gitignore");

  if (err) {
    console.log(".gitignore not found");
    return console.error(err);
  }
  console.log(".gitignore copied!")
  });

    console.log("theFiles: " + theFiles);
    theFiles.forEach(function(currentFile) {
      var genFileFunc = generateFileFunc(destDir + "/" + currentFile, packageName, appName);
      callItems.push(genFileFunc);

    });

    async.parallel(callItems, function(err, results) {
      
      if(err) {
        console.error("**** ERROR ****");
      } else {
        
        // Now, all items have been executed, perform the copying/etc.
        createSourceDirectories(destDir, packageName);
        copySourceDirectories(destDir, packageName); 
        
        //moved inside copySource method
        //removeBootstrapDirectories(destDir); 
        
        //sendContentAsZip(destDir, res);

      }
    }); 
}

function removeTemp(tempDir){
   console.log("Removing Temp");
   fsExtra.removeSync(tempDir)
}

function createTemp(tempDir){
  console.log("Creating Temp");
  fsExtra.mkdirsSync(tempDir);
}

function sendContentAsZip(destDir, res) {
  
  var fileObjects = getFileObjectsFrom(destDir, wrench.readdirSyncRecursive(destDir));
  
  var archive = new zip();
  archive.addFiles(fileObjects, function(err) {
    if(err) {
      console.log(err);
      res.statusCode = 500;
      res.end(); 
    } else {
      
      archive.toBuffer(function(buff) {
        
        res.contentType('zip');
        res.setHeader('Content-disposition', 'attachment; filename=android-bootstrap.zip');
        res.send(buff);
        res.end();        

        wrench.rmdirSyncRecursive(destDir, false)
      }); 

      
    }
      
  });
 
}

function getFileObjectsFrom(destDir, files) {
  var fileObjs = []
  for(var i=0; i<files.length;i++) {
    var filePath = destDir + "/" + files[i];
    var stats = fs.lstatSync(filePath);
    if(!stats.isDirectory())
      fileObjs.push({ name: files[i], path: filePath });
  }
  return fileObjs;
}

function generateFileFunc(file, packageName, appName) {
  return function(callback) {
    generateFile(file, packageName, appName, callback);
  }
}

function removeBootstrapDirectories(destDir) {

  // TODO: remove the old bootstrap source, unit-test and integration-test folders that are not valid anymore.
  console.log("Removing temporary work directories.");
  
  // Clean up - delete all the files we were just working with. 
  var bootstrapSourceDir = destDir + "/app/src/main/java/com/donnfelker"; 
  var bootstrapUnitTestDir = destDir + "/app/src/test/java/com/donnfelker"; 
  var integrationTestDir = destDir +  "/integration-tests/src/main/java/com/donnfelker"; 

  console.log("Removing: " + bootstrapSourceDir);
  console.log("Removing: " + bootstrapUnitTestDir);
  console.log("Removing: " + integrationTestDir);
  
  wrench.rmdirSyncRecursive(bootstrapSourceDir, false);
  wrench.rmdirSyncRecursive(bootstrapUnitTestDir, false);
  wrench.rmdirSyncRecursive(integrationTestDir, false);

}

function removeBootstrapSourceDir(destDir) {

  // TODO: remove the old bootstrap source, unit-test and integration-test folders that are not valid anymore.
  console.log("Removing temporary work directories.");
  
  // Clean up - delete all the files we were just working with. 
  var bootstrapSourceDir = destDir + "/app/src/main/java/com/donnfelker"; 

  console.log("Removing: " + bootstrapSourceDir);
  
  wrench.rmdirSyncRecursive(bootstrapSourceDir, false);

}

function removeBootstrapUnitTestDir(destDir) {

  // TODO: remove the old bootstrap source, unit-test and integration-test folders that are not valid anymore.
  console.log("Removing temporary work directories.");
  
  // Clean up - delete all the files we were just working with. 
  var bootstrapUnitTestDir = destDir + "/app/src/test/java/com/donnfelker"; 

  console.log("Removing: " + bootstrapUnitTestDir);

  wrench.rmdirSyncRecursive(bootstrapUnitTestDir, false);

}

function removeIntegrationTestDir(destDir) {

  // TODO: remove the old bootstrap source, unit-test and integration-test folders that are not valid anymore.
  console.log("Removing temporary work directories.");
  
  // Clean up - delete all the files we were just working with. 
  var integrationTestDir = destDir +  "/integration-tests/src/main/java/com/donnfelker"; 

  console.log("Removing: " + integrationTestDir);
  
  wrench.rmdirSyncRecursive(integrationTestDir, false);

}

// Creates the various new folder structures needed for the users new project. 
function createSourceDirectories(destDir, packageName) {

  var newPathChunk = getNewFilePath(packageName);

  var newSourceDirectory = destDir + "/app/src/main/java/" + newPathChunk; 
  console.log("Creating new source directory at: " + newSourceDirectory);
  wrench.mkdirSyncRecursive(newSourceDirectory); 

  var newUnitTestDirectory = destDir + "/app/src/test/java/" + newPathChunk; 
  console.log("Creating new source directory at: " + newUnitTestDirectory);
  wrench.mkdirSyncRecursive(newUnitTestDirectory); 

  var newIntegrationTestDirectory = destDir + "/integration-tests/src/main/java/" + newPathChunk; 
  console.log("Creating new integration tests directory at: " + newIntegrationTestDirectory);
  wrench.mkdirSyncRecursive(newIntegrationTestDirectory);     
}

function copySourceDirectories(destDir, packageName) {

  console.log(destDir);
  console.log(packageName);
  
  
  var newPathChunk = getNewFilePath(packageName);

  var oldSourceDir = destDir  +  "/app/src/main/java/com/donnfelker/android/bootstrap";  
  var newSourceDir = destDir    +  "/app/src/main/java/" + newPathChunk; 
  console.log("Copying source from" + oldSourceDir + " to directory " + newSourceDir);
  //wrench.copyDirSyncRecursive(oldSourceDir, newSourceDir); 
  fsExtra.copy(oldSourceDir, newSourceDir, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("success!");
    removeBootstrapSourceDir(destDir);
  }
}); //copies directory, even if it has subdirectories or files

  var oldUnitTestDir = destDir + "/app/src/test/java/com/donnfelker/android/bootstrap";
  var newUnitTestDir = destDir + "/app/src/test/java/" + newPathChunk; 
  console.log("Copying source from" + oldUnitTestDir + " to directory " + newUnitTestDir);
  //wrench.copyDirSyncRecursive(oldUnitTestDir, newUnitTestDir); 
    fsExtra.copy(oldUnitTestDir, newUnitTestDir, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("success!");
    removeBootstrapUnitTestDir(destDir);
  }
}); //copies directory, even if it has subdirectories or files

  var oldIntegrationTestDir = destDir + "/integration-tests/src/main/java/com/donnfelker/android/bootstrap";
  var newIntegrationTestDir = destDir + "/integration-tests/src/main/java/" + newPathChunk; 
  console.log("Copying source from" + oldIntegrationTestDir + " to directory " + newIntegrationTestDir);
 // wrench.copyDirSyncRecursive(oldIntegrationTestDir, newIntegrationTestDir);     
   fsExtra.copy(oldIntegrationTestDir, newIntegrationTestDir, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("success!");
    removeIntegrationTestDir(destDir);
  }
}); //copies directory, even if it has subdirectories or files
}

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function generateFile(file, packageName, appName, callback) {

  var stats = fs.lstatSync(file);
  if(!stats.isDirectory() && !file.substr(file.lastIndexOf('.') + 1).match("png")) {
    // Only work with text files, no directories or png files.  
    // Above == terrible code, but for android-bootstrap, it works. Pragmatic & KISS. FTW.
    
    // Must include the encoding otherwise the raw buffer will
    // be returned as the data.
    var data = fs.readFileSync(file, 'utf-8');
        
    //console.log("Current File: " + file);
  
    console.log("File: " + file);
    // Sure, we could chain these, but this is easier to read.
    data = replacePackageName(data, packageName);
    data = replaceAuthToken(data, packageName);
    data = replaceAppName(data, appName);
    data = replaceHyphenatedNames(data, packageName);
    data = replaceProguardValues(data, packageName);

    // Finally all done doing replacing, save this bad mother.
    fs.writeFileSync(file, data); 
  }

   // Call back to async lib. 
    callback(null, file);
}


// Turns a package name into a file path string. 
// Example: com.foo.bar.bang turns into com\foo\bar\bang
function getNewFilePath(newPackageName) {
  return newPackageName.split('.').join('/'); 
}

function getOldFilePath() {
  return "com.donnfelker.android.bootstrap".split('.').join('/'); 
}

// Takes the old boostrap file name and returns the new file name
// that is created via the transform from the new package name. 
function getBootstrappedFileName(bootstrapFileName, newPackageName) {
  return bootstrapFileName.replace( getOldFilePath(), getNewFilePath(newPackageName) );
}

function replacePackageName(fileContents, newPackageName) {
  var BOOTSTRAP_PACKAGE_NAME = "com.donnfelker.android.bootstrap"; // replace all needs a regex with the /g (global) modifier
  var packageNameRegExp = new RegExp(BOOTSTRAP_PACKAGE_NAME, 'g');
          
  // Replace package name
  return fileContents.replace(packageNameRegExp, newPackageName);
}

function replaceAuthToken(fileContents, newPackageName) {
  var BOOTSTRAP_TOKEN = "com.androidbootstrap";
  var tokenRegExp = new RegExp(BOOTSTRAP_TOKEN, 'g'); // global search

  return fileContents.replace( tokenRegExp, newPackageName );
}

function replaceAppName(fileContents, newAppName) {
  var APP_NAME = "Android Bootstrap";
  var nameRegExp = new RegExp(APP_NAME, 'g'); // global search

  return fileContents.replace(nameRegExp, newAppName);
}

function replaceHyphenatedNames(fileContents, newPackageName) {
  var newHyphenatedName = newPackageName.toLowerCase().split('.').join('-');
  var hyphenatedRegExp = new RegExp("android-bootstrap", 'g'); // global search

  return fileContents.replace(hyphenatedRegExp, newHyphenatedName);
}

function replaceProguardValues(fileContents, newPackageName) {
  var newValue = newPackageName + '.'; 
  var valueToFind = new RegExp("com.donnfelker.android.", 'g');

  return fileContents.replace(valueToFind, newValue);
}