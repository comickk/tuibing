var global = require('Global');
var SoundName = cc.Enum({
    CREATECARD:0,
    DEALCARD:-1,
    DICE:-1,
    BET:-1,
    CLOCK:-1
});
cc.Class({
    extends: cc.Component,

    properties: {

        bgm:[cc.AudioClip],

        sound:[cc.AudioClip],//
       
        _volume:1,
        _bgmid:0,
    },

    // use this for initialization
    onLoad: function () {
        global.ac = this.node;
        cc.game.addPersistRootNode(this.node);
        // this.node.on('dead',function(event){
        //     //if(Math.random() < 0.6) return;
        //     var r = Math.random();
        //     if(event.detail.type > 12 ){
        //         if(Math.random() < 0.8){
        //             r = Math.round(r*3);
        //             cc.audioEngine.play(this.fishdeadspeak[r], false, global.volume);}
        //     }else{
        //         if(Math.random() < 0.334){
        //             r = 4+Math.round(r*3);
        //             cc.audioEngine.play(this.fishdeadspeak[r], false, global.volume);}
        //     }
            
        // },this);

       
         this.node.on('createcard',function(){
             cc.audioEngine.play(this.sound[SoundName.CREATECARD], false,this._volume);
         },this);
         this.node.on('dealcard',function(){
            cc.audioEngine.play(this.sound[SoundName.DEALCARD], false,this._volume);
        },this);

        this.node.on('dice',function(){
            cc.audioEngine.play(this.sound[SoundName.DICE], false,this._volume);
        },this);

        this.node.on('bet',function(){
            cc.audioEngine.play(this.sound[SoundName.BET], false,this._volume);
        },this);

        this.node.on('clock',function(){
            cc.audioEngine.play(this.sound[SoundName.CLOCK], false,this._volume);
        },this);


        if(this._bgmid==0)
            this._bgmid=cc.audioEngine.play(this.bgm[0], true, this._volume*0.7);
        
    },

    
});
