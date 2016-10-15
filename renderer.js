// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
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
    var usePolicyFromImage = !document.getElementById('fetch-policy-from-image').checked,
        policyTextArea = document.getElementById('policy-text-area');
    console.log(usePolicyFromImage);
    if (!usePolicyFromImage) {
        policyTextArea.style.display = 'block';
    } else {
        policyTextArea.style.display = 'none';
    }
}, false);

/**
 * Target file picker
 * @type {[type]}
 */

document.getElementById('select-output-file').addEventListener('click', () => {
    dialog.showOpenDialog({properties: ['openDirectory']}, function (fileName) {
        if (!fileName){
            console.log("You didn't save the file");
            return;
        }
        document.getElementById('output-file').value = fileName[0];
        params['output-file'] = fileName[0];
    });
}, false);

/**
 * Builds command to execute PCDBridge
 * @param  {String} email [Email address of currently authenticated user]
 * @param  {String} filename [Input file to be decrypted]
 * @return {String} [Command to execute bridge]
 */
var getCmd = function() {
    return 'java -jar ' + __dirname + path.sep + 'lib' + path.sep + 'ABE_Encryptor.jar' + ' ' + params['ca-pub'] + ' ' + getPolicy() + ' ' + params['input-file'] + ' ' + params['output-file'];
};

var executeBridge = function() {
    var cmd = getCmd();

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
