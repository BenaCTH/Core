var GUID = function(){
   var guid = "", n;
            for (var i = 1; i <= 32; i++) {
                n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
}
