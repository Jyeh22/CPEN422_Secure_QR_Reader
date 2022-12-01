/* This is a module that takes a screencap of a website and returns 
 * that image as a byte stream
 */

const fs = require('fs');
const puppeteer = require('puppeteer')

//test urls
//url = 'https://old.reddit.com/r/programming/';
//url = 'https://www.google.ca/';
//url = 'https://en.wikipedia.org/wiki/Mapo_tofu'
//url = 'https://www.carlinorestaurant.com/menu';
//url = "https://www.moddb.com/downloads/stalker-anomaly-151"
//url = "http://cascadeinvestments.us" //THIS IS A PHISHING SITE

//puppeteer initiates a headless browser and navigates to the page
//Takes a string representing a url
async function getScreencap(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //for mobile case
        //await page.emulate(puppeteer.KnownDevices["iPhone 13 Pro"])
        await page.emulateMediaType('screen');
        await page.goto(url, {waitUntil: "domcontentloaded"});
        
        var screenshot =  await page.screenshot({   /*path: 'screenshot.png',*/ 
                                                    fullPage : true,
                                                });
        
        //test code to instead output a pdf
        //await page.pdf({ path: 'page.pdf',printBackground: true})
        //test code to instead output html file
        /*fs.writeFileSync('page.html',await page.content(), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });*/
        await browser.close();
        return screenshot;
    } catch (error) {
        console.error(error);
    }
}

//getScreencap().then((results)=>{console.log(results)});

module.exports = getScreencap;