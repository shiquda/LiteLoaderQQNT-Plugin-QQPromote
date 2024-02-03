const axios = require('axios');

async function getHtml(url) {
    const response = await axios.get(url);
    const html = response.data;
    const headContent = html.match(/<head([\s\S]*?)\/head>/i)[1];
    return headContent
}

async function getLinkPreview(url) {
    const data = {};
    const headContent = await getHtml(url);
    /**
     * @type {string[]} meta信息
     */
    const metaMatches = headContent.match(/[<meta[\s\S]*?>|<title(.*)\/title>]/ig);
    console.timeLog('headContent')
    metaMatches.forEach(element => {
        element.includes('</title>') && (data.title = element.match(/[<title>]?(.*)<\/title>/)[1])
            || element.includes('property="og:title"') && (data.title = element.match(/content="([\s\S]*)"/)[1])
        element.includes('name="description"') && (data.description = element.match(/content="([\s\S]*)"/)[1])
            || element.includes('property="og:description"') && (data.description = element.match(/content="([\s\S]*)"/)[1])
        element.includes('name="image"') && (data.image = element.match(/content="([\s\S]*)"/)[1])
            || element.includes('property="og:image"') && (data.image = element.match(/content="([\s\S]*)"/)[1])
    });
    return data;
}

module.exports = {
    getLinkPreview,
}