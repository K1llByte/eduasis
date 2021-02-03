const BagIt = require('bagit-fs');
const fs = require('fs');
const extract = require('extract-zip');
const AdmZip = require('adm-zip');

//var bag = BagIt('./folder', 'sha256');
//extract('coisas.zip',{dir:"coisas/"});

const zip = new AdmZip("./coisas.zip");
zip.extractAllTo("coisas/", true);