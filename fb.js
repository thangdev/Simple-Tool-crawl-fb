//Code  Crawl các thông tin của user về:  about basic, groups đã tham gia, pages đã like
// input : token, UID
// output: json data 
const fs = require('fs')
const globalTunnel = require('global-tunnel-ng')
const moment = require('moment')
const config = require('./config/token')
const axios = require('axios');



const beginURL = 'https://graph.facebook.com/';

// Demo tool with all id = me
const listUID = new Array(5).fill('me');



// crawl toan bo page mà user đã like

const crawl_PagesLiked = async id => {
    let arrayPages = [];
    let pages = 0;

    const crawlDequy_pages = async link => {
        try {
            const response = await axios.get(link);
            // arrayPagesLiked = [...arrayPagesLiked, ...response.data.data];
            arrayPages.push(response.data.data)
            const nextLink = response.data.paging.next;
            if (nextLink) {
               // console.log('nextlink crawl page: ', nextLink);
                await crawlDequy_pages(nextLink);
            } else {
                return arrayPages;
            }
        } catch (error) {
            console.log('co loi:  ', error.message)
        }
    }

    try {
        const link = `${beginURL}${id}${config.pages}${config.token}`;
        const response = await axios.get(link);
        //arrayPagesLiked = [...arrayPagesLiked, ...response.data.likes.data];
        arrayPages.push(response.data.likes.data)
        const nextLink = response.data.likes.paging.next;
        if (nextLink) {
           // console.log('nextLink crawl page: ', nextLink)
            await crawlDequy_pages(nextLink);
        } else {
            return arrayPages;
        }
    } catch (error) {
        console.log(error.message)
    }
    return arrayPages;

}


// crawl toàn bộ group mà user đã tham gia
const crawl_GroupsJoined = async id => {
    let arrayGroups = [];

    const crawlDequy_Groups = async link => {
        try {
            const response = await axios.get(link);
            // arrayPagesLiked = [...arrayPagesLiked, ...response.data.data];
            arrayGroups.push(response.data.data)
            const nextLink = response.data.paging.next;
            if (nextLink) {
                //console.log('nextlink crawl groups ', nextLink)
               // console.log(arrayGroups.length)
                await crawlDequy_Groups(nextLink);
            } else {
                return arrayGroups;
            }
        } catch (error) {
            console.log('Co loi: ', error.message)
        }
    }

    try {
        const link = `${beginURL}${id}${config.groups}${config.token}`;
        const response = await axios.get(link);
        arrayGroups.push(response.data.groups.data)
        const nextLink = response.data.groups.paging.next;
        if (nextLink) {
            //console.log('nextLink crawl group: ', nextLink)
            await crawlDequy_Groups(nextLink);
        } else {
            return arrayGroups;
        }
    } catch (error) {
        console.log(error.message)
    }
    return arrayGroups;

}


// crawl basic info cua user
const crawl_BasicInfo = async id => {
    let data = null;
    try {
        let link = `${beginURL}${id}${config.basic_info}${config.token}`;
        //console.log('link crawl basic info: ', link)
        let response = await axios.get(link);
        data = response.data;

    } catch (error) {
        console.log('Có lỗi khi crawl basic info', error.message)
    }
    return  data;

}


const crawlListUID = async listUID => {
    let count = 0;
    fs.writeFileSync('data.json', '[')
    let begin = new Date();
    for(let i = 0; i < listUID.length; i ++){
       
        console.log(`User id = ${listUID[i]}`)
        try {
            res = {basic_Info: '', groups_Joined: [], pages_Liked:[]}
            await crawl_BasicInfo( listUID[i] )
                .then(basic_info => {
                    res.basic_Info = basic_info
                })
                .catch(err => console.log(error))

            await crawl_PagesLiked( listUID[i] )
                .then(data => {
                    pages_info = data.reduce((v, i) => [...v, ...i], [])
                    res.pages_Liked = pages_info;
                    
                })
                .catch(err => console.log(err))
            await crawl_GroupsJoined( listUID[i] )
                .then(data => {
                    groups_info = data.reduce((v, i) => [...v, ...i], [])
                    res.groups_Joined = groups_info;
                })
                .catch(err => console.log(err))

            if(i == listUID.length -1){
                fs.appendFileSync('data.json', JSON.stringify(res) + ']')
            }else{
                fs.appendFileSync('data.json', JSON.stringify(res) + ',' )
            }
            console.log("-----Tong so pages: ", res.pages_Liked.length);
            console.log("-----Tong so groups: ", res.groups_Joined.length)

            count ++;
            console.log('\n')



        } catch (error) {
            console.log('Có lỗi trong function CrawlListUID: ', error)
        }
    }
    console.log(`Đã crawl được : ${count} user`);
    let end = new Date();
    console.log('Bắt đầu crawl lúc: ', moment.utc(begin).local())
    console.log('Kết thúc crawl lúc: ', moment.utc(end).local())


}
crawlListUID(listUID)


