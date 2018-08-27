#!/bin/bash
# Spec Runner

# To make this file runnable:
#     $ chmod +x *.sh.command

projectHome=$(cd $(dirname $0); pwd)

setupTools() {
   # Check for Node.js installation and download project dependencies
   cd $projectHome
   pwd
   echo
   echo "Node.js:"
   which node || { echo "Need to install Node.js: https://nodejs.org"; exit; }
   node --version
   npm install
   npm update
   npm outdated
   echo
   }

showVersions() {
   cd $projectHome
   echo "Local changes:"
   git status --short
   echo
   echo "Releases:"
   git tag
   echo
   echo "Current version:"
   versionLocal=v$(grep '"version"' package.json | awk -F'"' '{print $4}')
   echo $versionLocal
   echo
   echo "To publish release:"
   echo "   cd $projectHome"
   echo "   git tag --annotate --force --message 'Release' $versionLocal"
   echo "   git remote --verbose"
   echo "   git push origin --tags --force"
   echo "   npm publish"
   echo
   }

runSpecs() {
   cd $projectHome
   npm test
   echo
   }

echo
echo "browser-fetch-json"
echo "=================="
setupTools
showVersions
runSpecs
