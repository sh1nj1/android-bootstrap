#!/bin/sh

if [ $# -ne 2 ]
	then echo "usage $0 \"App Name\" \"PackageName\""
else
	appName=$1
	packageName=$2

echo "copying script files"
cp -Rf ./script/* ../
cd ..
node generate.js "$appName" "$packageName"
fi
