var objectUtil = {};
objectUtil = {
  getClass : function(){
     return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
  },
  isDate:function( date ){
    return objectUtil.getClass(date) == 'Date';
  },
  isObject:function(obj){
    return objectUtil.getClass(obj) =="Object";
  },
  isJQueryObject:function(){
    return this.isObject(obj) && obj.constructor === jQuery;
  },
  /**
  * 深拷贝一个对象
  * clone
  */
  clone:function(obj){
   if (typeof (obj) != 'object') {
                return obj;
            }

            var re = {};
            if (obj.constructor == Array) {
                re = [];
            }

            for (var i in obj) {
                re[i] = this.clone(obj[i]);
            }

            return re;
  }
};
