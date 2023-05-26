# Codespace Deep Link Abuse PoC

## Files description

### `.devcontainer/devcontainer.json`

It loads the giraffe-ltd.wild-running-giraffes extension which then execute the code in `exploit.js`. I use this extension to avoid publishing a malcious extension on the Microsoft VSCode store.

### `exploit.js`

It launches a local terminal in the codespace (that's the codespace escape) and send the code contained in `exploit.ps1` (a powershell script). Right now only Windows is supported in the PoC but all systems are affected.

### `exploit.ps1`

It collects all the cookies with the domains `github.com` and `.github.com` and partially decrypt them (since you can only decrypt them on the windows system), the public ip address and create a gist on GitHub with all the data.
The data will be finally decrypted in `getVictim.js`

### `getVictims.js`

This is not part of the exploit executed on the victim system, this tool is used by the attacker to collect and decrypt the information in the git.
It fins all the gists matching the format of `exploit.ps1` and display all the cookie key and values belonging to domains `github.com` and the ip address of the victim on the console. Allowing the attacker to hijack the victim github session.
Usage:
```
node getVictim.js gh_token
```
*Note: The gh_token need the gist permission.*

### System.Data.SQLite.dll

This file is required on windows to allow `exploit.ps1` to read the Microsoft Edge Cookie since the cookie file is saved as an sqlite3 database. Since we're  forced to partially decrypt the cookie on the windows system to extract the key, nonce and tag of the `aes-256-gcm` encryption.
