const {spawnSync} = require('child_process');

/**
 * Executes a command, returns null if it fails or stdout in case everything went fine
 * @returns {string|null}
 */
const exec = (cmd, ...args) => {
    const subProcess = spawnSync(cmd, args, {timeout: 6000});
    return subProcess.error ?
        null : subProcess.stdout.toString('utf-8').trim();
};

/**
 * Fetches the latest tag and adds a build number.
 * In case there is no tag 0.0.0 will be used
 * @returns {string}
 */
module.exports = () => {
    const totalCommits = exec('git', 'rev-list', '--count', 'HEAD');
    const lastTag = exec('git', 'describe', '--tags', '--abbrev=0');

    if (lastTag) {
        const commitsFromTag = exec('git', 'rev-list', '--count', lastTag);
        return `${lastTag}.${totalCommits - commitsFromTag}`;
    } else {
        return `0.0.0.${totalCommits}`;
    }
};
