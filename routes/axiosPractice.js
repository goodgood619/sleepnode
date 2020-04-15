const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
router.post('/',async (req,res)=>{
    let url = req.body.link[0]
    const getHtml = async () => {
        try {
            return await axios.get(url);
        }catch (e) {
            console.log(e)
        }
    }
    const one = getHtml()
        .then(html=> {
            const $ = cheerio.load(html.data);
            let linkTitle="", linkChannel = "";
            $('h1 > span').each(function (i,e) {
                linkTitle = $(e).text().slice(5,$(e).text().length-3);
            })
            $('div > div > div > div > div > div > div > div > div > div > div > a').each(function (i,e) {
                linkChannel = $(e).text()
            })
            return {linkTitle,linkChannel}
        })
        one.then(ret => {
            let linkAddress = "", data=""
            if(url.match("watch")){
                linkAddress = url.substring(url.indexOf('=')+1,url.size);
                data = 'https://www.youtube.com/embed/' + linkAddress
            }
            else {
                linkAddress = url.substring(url.indexOf('.be')+4,url.size)
                data = 'https://www.youtube.com/embed/' + linkAddress
            }
            res.json({linkTitle: ret.linkTitle, linkChannel : ret.linkChannel,linkAddress : data})
        })
            .catch(err=> {
                console.log(err)
            })
})


module.exports = router