//浏览器版本
    var browser = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            match[1] = 'msie';
        }
        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    }((navigator.userAgent));
