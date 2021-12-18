
const Netflix = require('netflix2')
const { GistBox } = require('gist-box')
var moment = require('moment');

const gistId = process.env.GIST_ID
const ghToken = process.env.GH_TOKEN

const updateGist = async (content) => {
    const box = new GistBox({ id: gistId, token: ghToken })
    await box.update({
        filename: 'netflix.txt',
        description: '🍿 Netflix view history.',
        content
    })
}

var credentials = {
    email: process.env.NETFLIX_EMAIL,
    password: process.env.NETFLIX_PASSWORD
}
const guid = process.env.NETFLIX_GUID
const maxItems = process.env.NETFLIX_MAX_ITEMS || 10;
const minDuration = process.env.NETFLIX_MIN_DURATION || 1200;

var netflix = new Netflix()

const main = async () => {
    await netflix.login(credentials);
    if (guid) await netflix.switchProfile(guid)
    const history = await netflix.__getViewingHistory(0)
    const filteredHistory = history.viewedItems
        .filter(v => v.duration > minDuration)
        .slice(0, maxItems);
    const content = filteredHistory
        .map((v) => {
            let line = ''
            if (v.seriesTitle) line += v.seriesTitle + ' '
            line += v.title + ' '
            line += 'for ' + moment.duration(v.duration * 1000).humanize() + ', '
            line += moment(v.date).fromNow()
            return line
        }).join('\n')
    await updateGist(content);
}

main();