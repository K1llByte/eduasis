const BagIt = require('bagit-fs');
const fs = require('fs');
const extract = require('extract-zip');
const AdmZip = require('adm-zip');
const lineReader = require('line-reader');

//var bag = BagIt('./folder', 'sha256');
//extract('coisas.zip',{dir:"coisas/"});

const zip = new AdmZip("./artigo2-exemplo.zip");
zip.extractAllTo("./", true);

// var bag = BagIt('artigo2-exemplo/', 'sha256')

// BagIt.readManifest((err,entries) => {
//     if(err)
//     {
//         console.log("Error:",err);
//     }
//     else
//     {
//         console.log("Entries",entries);
//     }
// });

////////////////////////////////////////////////////////////////////////

// lineReader.eachLine('artigo2-exemplo/bags/artigo2-exemplo/manifest-sha256.txt', (line) => {
    
//     line.split('  ')[1]
//     console.log(`"${}"`);

// });


var name = "artigo2-exemplo.zip";


var tmp = name.split('.');
tmp = tmp.slice(0,tmp.length-1)
folder_name = tmp.join('.');
