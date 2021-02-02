const BagIt = require('bagit-fs');
const fs = require('fs');
const extract = require('extract-zip');
var AdmZip = require('adm-zip');

//var bag = BagIt('./folder', 'sha256');
//extract('coisas.zip',{dir:"coisas/"});

var zip = new AdmZip("./coisas.zip");

zip.extractAllTo("coisas/", /*overwrite*/true);