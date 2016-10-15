// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let app = require('electron').remote,
    dialog = app.dialog,
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path');

const params = {};

/**
* File picker for input file
*/
document.getElementById('select-input-file').addEventListener('click', () => {
    dialog.showOpenDialog((fileNames) => {
        document.getElementById("input-file").value = fileNames[0];
        params['input-file'] = fileNames[0];
    });
}, false);

/**
* File picker for CA public key
*/
document.getElementById('ca-pub').addEventListener('click',() => {
    dialog.showOpenDialog((fileNames) => {
        document.getElementById("ca-pub-file").value = fileNames[0];
        params['ca-pub'] = fileNames[0];
    });
}, false);

/**
* Handler for Encrypt button
*/
document.getElementById('encrypt').addEventListener('click', () => {
    console.log(executeBridge());
}, false);

/**
 * Show policy text area
 * @type {[type]}
 */
document.getElementById('fetch-policy-from-image').addEventListener('click', () => {
    let policyTextArea = document.getElementById('policy-text-area');

    if (!usePolicyFromImage()) {
        policyTextArea.style.display = 'block';
    } else {
        policyTextArea.style.display = 'none';
    }
}, false);

/**
 * Builds command to execute PCDBridge
 * @param  {String} email [Email address of currently authenticated user]
 * @param  {String} filename [Input file to be decrypted]
 * @return {String} [Command to execute bridge]
 */
let getCmd = () => {
    return 'java -jar ' + __dirname + path.sep + 'lib' + path.sep + 'ABE_Encryptor.jar' + ' ' + params['ca-pub'] + ' \"' + getPolicy() + '\" ' + params['input-file'] + ' ' + getOutputFile();
};

let getPolicy = () => {
    let policy = null;
    if (!usePolicyFromImage()) {
        policy = document.getElementById('policy-text-area').value;
    } else {
        let md = fs.readFileSync(params['input-file']);
        var parser = require('exif-parser').create(md);
        parser.enableBinaryFields(true);
        var result = parser.parse();
        policy = result.tags['Copyright'];
    }
    return policy;
}

let getOutputFile = () => {
    let input = params['input-file'].split(path.sep),
        outputFile = 'enc_' + input[input.length -1],
        outputPath = '';
        for(let i = 0; i < input.length -1 ; i++) {
            outputPath += input[i] + path.sep;
        }
        console.log(outputPath + outputFile);
        return outputPath + outputFile;
}

let usePolicyFromImage = () => !document.getElementById('fetch-policy-from-image').checked;

let executeBridge = () => {
    let cmd = getCmd();
    exec(cmd, {}, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

        if (error || stderr) {
            return;
        }

        if(stdout) {
        }
    });
}
