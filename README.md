# Tool crawl user's data on facebook

  - Basic info of user(id, name, dob, location)
  - All groups user joined
  - All pages user liked

### Installation

Before run script you have to fill the token in config/token.js


```sh
module.exports = {
    token: '&access_token=<your token>',
    basic_info: '?fields=id,name,gender,birthday,email,hometown',
    pages: '?fields=likes.limit(5000)',
    groups: '?fields=groups.limit(5000)',
}
```
Install the dependencies and start the tool.


```sh
$ npm install 
$ node fb.js
```
Data crawled will be saved to data.json file