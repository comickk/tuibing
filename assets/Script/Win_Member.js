var global = require('Global'); 
cc.Class({
    extends: require("PopWin"),

    properties: {
       nick:cc.Label,
       gold:cc.Label,
       head:cc.Sprite,
    },   
   
    onLoad:function(){
        this._super();

        this.nick.string = global.selfinfo.nickname;
        this.gold.string = '0';
        if(global.selfinfo.headimg!= null)
            this.head.spriteFrame =global.selfinfo.headimg;
    },
});
