var crypto = require('crypto');

// format date, eg: formatDate(Date.now(), 'yyyy-MM-dd HH:mm')
exports.formatDate = function(date, format) {
    if(typeof date != 'object') {
        date = new Date(date);
    }
    format = format || 'yyyy-MM-dd HH:mm:ss';

    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1,  RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

// md5 content
exports.md5 = function(content) {
    return crypto.createHash('md5').update(content).digest('hex');
};

// get client ip address
exports.getClientIP = function(request) {
    var ipAddress;
    var forwardedIpsStr = request.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = request.connection.remoteAddress;
    }
    return ipAddress;
};

exports.getClientDeviceType = function(request) {
    var options = {
        emptyUserAgentDeviceType: 'desktop',
        unknownUserAgentDeviceType: 'phone',
        botUserAgentDeviceType: 'bot'
    };

    var ua = request.headers['user-agent'];
    if (!ua || ua === '') {
        // No user agent.
        return options.emptyUserAgentDeviceType;
    }

    if (ua.match(/GoogleTV|SmartTV|Internet TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i)) {
        // if user agent is a smart TV - http://goo.gl/FocDk
        return 'tv';
    } else if (ua.match(/Xbox|PLAYSTATION 3|Wii/i)) {
        // if user agent is a TV Based Gaming Console
        return 'tv';
    } else if (ua.match(/iP(a|ro)d/i) || (ua.match(/tablet/i) && !ua.match(/RX-34/i)) || ua.match(/FOLIO/i)) {
        // if user agent is a Tablet
        return 'tablet';
    } else if (ua.match(/Linux/i) && ua.match(/Android/i) && !ua.match(/Fennec|mobi|HTC Magic|HTCX06HT|Nexus One|SC-02B|fone 945/i)) {
        // if user agent is an Android Tablet
        return 'tablet';
    } else if (ua.match(/Kindle/i) || (ua.match(/Mac OS/i) && ua.match(/Silk/i)) || (ua.match(/AppleWebKit/i) && ua.match(/Silk/i) && !ua.match(/Playstation Vita/i))) {
        // if user agent is a Kindle or Kindle Fire
        return 'tablet';
    } else if (ua.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC( Flyer|_Flyer)|Sprint ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos S7|Dell Streak 7|Advent Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || (ua.match(/MB511/i) && ua.match(/RUTEM/i))) {
        // if user agent is a pre Android 3.0 Tablet
        return 'tablet';
    } else if (ua.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google Wireless Transcoder/i)) {
        // if user agent is unique phone User Agent
        return 'phone';
    } else if (ua.match(/Opera/i) && ua.match(/Windows NT 5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)) {
        // if user agent is an odd Opera User Agent - http://goo.gl/nK90K
        return 'phone';
    } else if ((ua.match(/Windows (NT|XP|ME|9)/) && !ua.match(/Phone/i)) && !ua.match(/Bot|Spider|ia_archiver|NewsGator/i) || ua.match(/Win( ?9|NT)/i)) {
        // if user agent is Windows Desktop
        return 'desktop';
    } else if (ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i)) {
        // if agent is Mac Desktop
        return 'desktop';
    } else if (ua.match(/Linux/i) && ua.match(/X11/i) && !ua.match(/Charlotte/i)) {
        // if user agent is a Linux Desktop
        return 'desktop';
    } else if (ua.match(/CrOS/)) {
        // if user agent is a Chrome Book
        return 'desktop';
    } else if (ua.match(/Solaris|SunOS|BSD/i)) {
        // if user agent is a Solaris, SunOS, BSD Desktop
        return 'desktop';
    } else if (ua.match(/curl|Bot|B-O-T|Crawler|Spider|Spyder|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|Charlotte|NewsGator|TinEye|Cerberian|SearchSight|Zao|Scrubby|Qseero|PycURL|Pompos|oegp|SBIder|yoogliFetchAgent|yacy|webcollage|VYU2|voyager|updated|truwoGPS|StackRambler|Sqworm|silk|semanticdiscovery|ScoutJet|Nymesis|NetResearchServer|MVAClient|mogimogi|Mnogosearch|Arachmo|Accoona|holmes|htdig|ichiro|webis|LinkWalker|lwp-trivial|facebookexternalhit/i) && !ua.match(/phone|Playstation/i)) {
        // if user agent is a BOT/Crawler/Spider
        return options.botUserAgentDeviceType;
    } else {
        // Otherwise assume it is a phone Device
        return options.unknownUserAgentDeviceType;
    }
};


exports.isMacDesktop = function(request) {
    var ua = request.headers['user-agent'];

    if (ua && ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i)) {
        return true;
    }
    else {
        return false;
    }
};

function getRes(status, code, data) {
    var res = {};

    res.status = status || 'success';
    code && (res.code = code);
    data && (res.data = data);

    return res;
};

exports.getRes = getRes;

exports.needLogin = function(req, res, next) {
    if(req.session.user) {
        next();
    }
    else {
        res.send(getRes('warning', 'NOT_LOGIN'));
    }
};

exports.needLogout = function(req, res, next) {
    if(!req.session.user) {
        next();
    }
    else {
        res.send(getRes('warning', 'NOT_LOGOUT'));
    }
};


exports.toObject = function(obj) {
    return typeof obj === 'object' ? obj : {};
};

exports.toFunction = function(func) {
    return typeof func === 'function' ? func : function() {};
};

exports.toArray = function(obj, allowType) {
    allowType = ['string', 'function'].indexOf(allowType) > -1 ? allowType : 'string';
    return Array.isArray(obj) ? obj : typeof obj === allowType ? [obj] : [];
};

exports.copyByKeys = function(keys, from, to) {
    to = to || {};

    keys.forEach(function(key) {
        to[key] = from[key];
    });

    return to;
};
