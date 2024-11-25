const crypto = require('crypto');
const https = require('https');
const readline = require('readline');

const targetHash = "578ed5a4eecf5a15803abdc49f6152d6";

const fileUrl = "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/500-worst-passwords.txt";

function md5Hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

function dictionaryAttackFromURL(url) {
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to fetch the file. HTTP Status: ${response.statusCode}`);
            return;
        }

        const rl = readline.createInterface({
            input: response,
            crlfDelay: Infinity,
        });

        rl.on('line', (password) => {
            const trimmedPassword = password.trim();
            const hash = md5Hash(trimmedPassword);

            if (hash === targetHash) {
                console.log(`Bob's password is: ${trimmedPassword}`);
                rl.close();
                response.destroy();
            }
        });


    }).on('error', (err) => {
        console.error(`Error fetching the file: ${err.message}`);
    });
}

dictionaryAttackFromURL(fileUrl);