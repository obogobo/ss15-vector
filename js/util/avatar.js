var crypto = require('crypto');

function retro(username){
    var hasher = crypto.createHash('md5'), hash;
    hasher.update('here is some salt');
    hasher.update(username);
    hash = hasher.digest('hex');
    return 'http://www.gravatar.com/avatar/'+hash+'?d=retro'
}

function robohash(username){
    return 'https://robohash.org/'+username+'.png?size=50x50&bgset=any';
}

module.exports = retro;
