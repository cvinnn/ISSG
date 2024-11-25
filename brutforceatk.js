const crypto = require('crypto');

const targetHash = "5531a5834816222280f20d1ef9e95f69";

function bruteForcePin() {
    for (let pin = 0; pin <= 9999; pin++) {
        // Format the PIN to 4 digits (e.g., 0000, 0123)
        const pinStr = pin.toString().padStart(4, '0');
        
        // Generate the MD5 hash
        const hash = crypto.createHash('md5').update(pinStr).digest('hex');

        // Compare the hash with the target hash
        if (hash === targetHash) {
            console.log(`Alice's PIN is: ${pinStr}`);
            return pinStr; // Exit after finding the match
        }
    }

    console.log("No PIN matched the hash.");
    return null;
}

// Execute the brute force attack
bruteForcePin();