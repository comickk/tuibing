var global = require('Global'); 
cc.Class({
    extends: require("Controller"),

    properties: {
        img_load:cc.Node,

        //----------------
        _wintip:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        global.anysdk = require('PluginAnySdk').Init();
       // global.socket = require('Socket').Init(); 

        var poplayer = cc.find('PopWinLayer');
        if(cc.isValid(poplayer)){            
            cc.game.addPersistRootNode(poplayer);
            var popbg = cc.find('PopWinLayer/popwinbg');
            popbg.on('touchend',function(){event.stopPropagation();});  
            global.wintip =  cc.find('PopWinLayer/Win_Tip');
        }
    },

    
    Btn_Login:function()
    {
        this.img_load.active = true;
        cc.director.loadScene('room');
    },

    Btn_Exit:function(){
        global.PopWinTip(1,'确定要退出吗？',function(){  cc.game.end();   });       
    },

    Event_Back:function(){
         global.PopWinTip(1,'确定要退出吗？',function(){  cc.game.end();   }); 
    },

   
});
