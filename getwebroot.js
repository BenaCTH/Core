    /**
		 * @method getWebRoot
		 */
     var getWebRoot = function () {
            var location = document.location;
            var webroot = location.protocol + "//" + location.host + '/' + location.pathname.split('/')[1];
            return webroot;
        }
