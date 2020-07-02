const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require('cheerio')
const youtubeThumbnail = require('youtube-thumbnail')
router.post('/youtube',async (req,res)=>{
    let url = req.body.link[0]
    // const getHtml = async () => {
    //     try {
    //         return await axios.get(url);
    //     }catch (e) {
    //         console.log(e)
    //     }
    // };
    // const async1 =  ()=>{
    //     return new Promise((fulfilled,rejected)=>{
    //         puppeteer.launch({headless: true}).then(async browser => {
    //             const page = await browser.newPage();
    //             await page.goto(url);
    //             try {
    //                 await page.waitForSelector('h1');
    //                 await page.waitForSelector('ytd-video-owner-renderer div ytd-channel-name div div yt-formatted-string a');
    //                 const title = await page.evaluate(()=> document.querySelector('h1').textContent);
    //                 const who = await page.evaluate(()=>document.querySelector('ytd-video-owner-renderer div ytd-channel-name div div yt-formatted-string a').textContent);
    //                 // console.log(title)
    //                 // console.log(who)
    //                 fulfilled({title,who})
    //             }
    //             catch(err){
    //                 // console.log(err)
    //                 rejected(err)
    //             }
    //         })
    //     })
    // };
    // async1().then(({title,who})=>{
    //     const thumbnail = youtubeThumbnail(url).high.url
    //     res.json({linkTitle: title, linkChannel : who,linkAddress : url,
    //         thumbnailUrl : thumbnail})
    // }).catch((error)=>{
    //     console.log(error)
    //     res.json({err :error})
    // })
    const thumbnail = youtubeThumbnail(url).high.url
    await res.json({
        linkAddress: url,
        thumbnailUrl: thumbnail
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