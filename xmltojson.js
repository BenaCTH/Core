    /**
		 * @method xmlToJson
		 */
      var  xmlToJson = function (xml) {
            // Create the return object
            var obj = {};
            if (xml.nodeType == 1) {// element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                } else {
                    if (!xml.hasChildNodes()) {
                        obj = xml.nodeValue || "";
                    }
                }
            } else if (xml.nodeType == 3) {// text
                obj = "";
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof (obj[nodeName]) == "undefined") {
                        if (item.nodeType == 3) {
                            obj = "";
                            obj = this.xmlToJson(item);
                        } else {
                            obj[nodeName] = this.xmlToJson(item);
                        }

                    } else {
                        if (typeof (obj[nodeName].length) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(this.xmlToJson(item));
                    }
                }
            }
            return obj;
        };
