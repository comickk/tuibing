var global = require('Global'); 
cc.Class({
    extends: require("PopWin"),

    properties: {
       nick:cc.Label,
       gold:cc.Label,
       head:cc.Sprite,
       username:cc.Label,

       _vol_music:0.0,
       _vol2:0.1,
    },   
   
    onLoad:function(){
        this._super();

        this.nick.string = global.selfinfo.nickname;
        this.gold.string = global.selfinfo.gold_count;
        this.username.string = '玩家账号('+global.selfinfo.user_code+')';

        if(global.selfinfo.headimg!= null)
            this.head.spriteFrame =global.selfinfo.headimg; 
    },

    Tog_music:function(){
        var vol =  this._vol_music;
       this._vol_music = global.vol_music;
       global.vol_music = vol;

       cc.audioEngine.setVolume(global.bgmid,global.vol_music);
    },

    Tog_sound:function(){
        
        var vol = this._vol2;       

        this._vol2 = global.vol_sound;        
        global.vol_sound = vol;        
        
    },

    Btn_KeFu:function(){
        cc.sys.openURL('http://'+global.socket.URL+'/help');
    },

    Btn_JuLeBu:function(){
        cc.sys.openURL('http://'+global.socket.URL+'/club');
    },   

});
