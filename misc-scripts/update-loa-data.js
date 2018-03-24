// const crypto = require('crypto');
const path = require("path");
const fs = require('fs');

const Promise = require('bluebird');
const rp = require('request-promise');

const cardsJsonUrl = 'http://loapk3.fingertactic.com/card.php?do=GetAllCard&phpp=FACEBOOK&phpl=EN&pvc=2.0&pvb=2016-09-13 14:52:31&sns=KONGREGATE&origin=';
const skillsJsonUrl = 'http://loapk3.fingertactic.com/card.php?do=GetAllSkill&phpp=FACEBOOK&phpl=EN&pvc=2.0&pvb=2016-09-13%2014%3A52%3A31&sns=KONGREGATE&origin=';
const runesJsonUrl = 'http://loapk3.fingertactic.com/rune.php?do=GetAllRune&phpp=FACEBOOK&phpl=EN&pvc=2.0&pvb=2016-09-13 14:52:31&sns=KONGREGATE&origin=';
const mapsJsonUrl = 'http://loapk3.fingertactic.com/mapstage.php?do=GetMapStageALL&stageNum=10&Mode=1&phpp=FACEBOOK&phpl=EN&pvc=2.0&pvb=2016-09-13%2014%3A52%3A31&sns=KONGREGATE&origin=';

const files = [
    {
        url: cardsJsonUrl,
        fileName: 'cards'
    },
    {
        url: skillsJsonUrl,
        fileName: 'skills'
    },
    {
        url: runesJsonUrl,
        fileName: 'runes'
    },
    {
        url: mapsJsonUrl,
        fileName: 'maps'
    },
];

function jsonPathFromFileName(fileName, options) {
    options = options ? options : {};
    options.temp = options.temp ? options.temp : false;
    options.humanReadable = options.humanReadable ? options.humanReadable : false;
    options.dir = options.dir ? options.dir : 'public/loa-data/';

    let fileExt = '';
    fileExt += (options.temp ? '.temp' : '');
    fileExt += (options.humanReadable ? '.hr' : '');
    fileExt += '.json';

    return path.join(options.dir, fileName) + fileExt;
}

function unlinkIfExists(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

function downloadJson(url, outputFileName, remainingTries = 0) {
    const tempFilePath = jsonPathFromFileName(outputFileName, { temp: true });
    const tempHrFilePath = jsonPathFromFileName(outputFileName, {
        humanReadable: true,
        temp: true
    });
    const filePath = jsonPathFromFileName(outputFileName);

    rp.get({
        url: url,
        gzip: true,
        forever: true
    }).then(response => {
        fs.writeFileSync(tempFilePath, response);
        console.group(outputFileName.toUpperCase());
        console.log(`Downloaded ${outputFileName} to ${tempFilePath}`);

        console.log('Verifying that the file is a valid JSON file...');
        return JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));
    }, err => {
        if(err.code === 'ETIMEDOUT') {
            let endMsg = '';

            if(remainingTries > 0) {
                endMsg = 'Retrying...';
            } else {
                endMsg = `Failed to download ${outputFileName} JSON.`;
            }

            console.error(`Connection timed out. ${endMsg}`);

            if(remainingTries > 0) {
                downloadJson(url, outputFileName, remainingTries - 1);
            }

            return;
        }

        console.error(err);
    }).then(json => {
        console.log(`Verification of ${outputFileName} JSON successful.`);
        console.log(`Formatting ${outputFileName} for humans...`);

        return JSON.stringify(json, null, '\t');
    }).then(jsonString => {
        fs.writeFileSync(tempHrFilePath, jsonString);
        console.log(`Saved prettified JSON to ${tempHrFilePath}.`);

        console.log('Verifying that prettified file is a valid JSON file...');
        JSON.parse(fs.readFileSync(tempHrFilePath, 'utf8'));
        console.log('Verification successful.');

        console.log('Renaming final result...');
        fs.renameSync(tempHrFilePath, filePath);
        console.log(`Successfully renamed ${tempHrFilePath} to ${filePath}`);
    }).catch(err => {
        if(err instanceof SyntaxError) {
            console.error(`${tempFilePath} is not a valid JSON.`);
        } else {
            console.error(`Problem downloading ${outputFileName}.`);
            console.error(`Retrying...`);
        }

        console.error(err);
    }).finally(() => {
        console.log('Deleting temporary files...');

        unlinkIfExists(tempFilePath);
        unlinkIfExists(tempHrFilePath);

        console.log('Done');
        console.groupEnd();
    });
}

files.forEach(value => {
    console.log(`Downloading ${value.fileName} JSON...`);

    const RETRIES = 3;
    downloadJson(value.url, value.fileName, RETRIES);
});
