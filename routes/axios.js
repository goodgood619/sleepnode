const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const youtubeThumbnail = require('youtube-thumbnail')
router.post('/youtube',async (req,res)=>{
    let url = req.body.link[0]
    const getHtml = async () => {
        try {
            return await axios.get(url);
        }catch (e) {
            console.log(e)
        }
    };
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
            const thumbnail = youtubeThumbnail(url).high.url

            if(url.match("watch")){
                linkAddress = url.substring(url.indexOf('=')+1,url.size);
                data = 'https://www.youtube.com/embed/' + linkAddress
            }
            else {
                linkAddress = url.substring(url.indexOf('.be')+4,url.size)
                data = 'https://www.youtube.com/embed/' + linkAddress
            }
            res.json({linkTitle: ret.linkTitle, linkChannel : ret.linkChannel,linkAddress : data,
            thumbnailUrl : thumbnail})
        })
            .catch(err=> {
                console.log(err)
            })
})

router.post('/twitch',async (req,res)=>{
    let url = req.body.link[0];
    const getHtml = async () => {
        try {
            return await axios.get(url);
        }catch (e) {
            console.log(e)
        }
    };
    const one = getHtml()
        .then(html=> {
            const $ = cheerio.load(html.data);
            let linkTitle="", linkChannel = "";
            $('main > div > div > div > div > div > div > a > div > p').each(function (i,e) {
                linkTitle = $(e).text()
                console.log(linkTitle)
            })
            $('div > div > p > span').each(function (i,e) {
                linkChannel = $(e).text()
                console.log(linkChannel)
            })
            return {linkTitle,linkChannel}
        })
    one.then(ret => {
        let linkAddress = "", data=""
        if(url.match("clip")){
            const linkaddress = url.substring(url.indexOf('clip')+5,url.size);
            const data = 'https://clips.twitch.tv/embed?clip=' + linkaddress;
            // console.log(data)
        }
        else {
            const linkaddress = url.substring(url.indexOf('video')+7,url.size)
            const data = 'https://www.twitch.tv/videos/embed/' + linkaddress;
            //console.log(data)
        }
        res.json({linkTitle: ret.linkTitle, linkChannel : ret.linkChannel,linkAddress : data})
    })
        .catch(err=> {
            console.log(err)
        })
})
module.exports = router