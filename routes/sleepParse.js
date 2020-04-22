const express = require('express')
const router = express.Router()
const Promise = require('es6-promise'); // npm install es6-promise
const puppeteer = require('puppeteer'); // npm install puppeteer
router.post('/',async (req,res)=> {
    let url = req.body.link[0]
    const async1 =  ()=>{
        return new Promise((fulfilled,rejected)=>{
            puppeteer.launch({headless: true}).then(async browser => {
                const page = await browser.newPage().catch();
                await page.goto(url).catch();
                try {
                    await page.waitForSelector('h1');
                    await page.waitForSelector('ytd-video-owner-renderer div ytd-channel-name div div yt-formatted-string a')
                    const title = await page.evaluate(()=> document.querySelector('h1').textContent)
                    const who = await page.evaluate(()=>document.querySelector('ytd-video-owner-renderer div ytd-channel-name div div yt-formatted-string a').textContent)
                    fulfilled({title,who})
                }
                catch(err){
                    rejected(err)
                }
            })
        })
    };

    const async2 = () =>{
        return new Promise((done,reject)=>{
            if(url.match("watch")){
                const linkaddress = url.substring(url.indexOf('=')+1,url.size);
                const data = 'https://www.youtube.com/embed/' + linkaddress
                done(data)
            }
            else {
                const linkaddress = url.substring(url.indexOf('.be')+4,url.size)
                const data = 'https://www.youtube.com/embed/' + linkaddress
                done(data)
            }
        })
    };

    async1().then(({title,who})=> {
        async2().then((linkaddress)=> {
            console.log({title,who,linkaddress})
            res.json({linkTitle : title,
                linkChannel :who,
                linkAddress : linkaddress})
        })
    }).catch((error)=>{
        console.log(error)
        res.json({err : error})
    })
});


router.post('/saveboardtwitch',async (req,res)=>{
    let url = req.body.linkaddress
    let async1 =  ()=>{
        return new Promise((fulfilled,rejected)=>{
            puppeteer.launch({headless: true}).then(async browser => {
                const page = await browser.newPage();
                await page.goto(url);
                try {
                    await page.waitForSelector('main div div div div div div a div p');
                    await page.waitForSelector('div div p span');
                    const title = await page.evaluate(()=> document.querySelector('div div p span').textContent);
                    const who = await page.evaluate(()=>document.querySelector('main div div div div div div a div p').textContent);
                    // console.log(title);
                    // console.log(who);
                    fulfilled({title,who})
                }
                catch(err){
                    // console.log(err)
                    rejected(err)
                }
            })
        })
    };

    let async2 = () =>{
        return new Promise((done,reject)=>{
            if(url.match("clip")){
                const linkaddress = url.substring(url.indexOf('clip')+5,url.size);
                const data = 'https://clips.twitch.tv/embed?clip=' + linkaddress;
                // console.log(data)
                done(data)
            }
            else {
                const linkaddress = url.substring(url.indexOf('video')+7,url.size)
                const data = 'https://www.twitch.tv/videos/embed/' + linkaddress;
                //console.log(data)
                done(data)
            }
        })
    };

    async1().then(({title,who})=> {
        async2().then((linkaddress)=> {
            if(req.body.title !=="") {
                const boardcontentdb = new boardcontent({
                    category: req.body.category, likenumber: 0, dislikenumber: 0, linkaddress: url,
                    videolinkaddress: linkaddress, title: req.body.title, author: req.body.author,
                    password: req.body.password, reportcnt: 0, iframetoggle: false,
                    replytoggle: false, linkauthor: who, linktitle: title
                });
                boardcontentdb.save((err, obj) => {
                    if (err) {
                        console.log(err);
                        throw err
                    }
                    res.json({test: obj})
                })
            } else {
                const boardcontentdb = new boardcontent({
                    category: req.body.category, likenumber: 0, dislikenumber: 0, linkaddress: url,
                    videolinkaddress: linkaddress, title: title, author: req.body.author,
                    password: req.body.password, reportcnt: 0, iframetoggle: false,
                    replytoggle: false, linkauthor: who, linktitle: title
                });
                boardcontentdb.save((err, obj) => {
                    if (err) {
                        console.log(err);
                        throw err
                    }
                    res.json({test: obj})
                })
            }
        })
    }).catch((error)=>{
        console.log(error);
        res.json({err : error})
    })
});

module.exports = router