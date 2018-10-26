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

        bgm:{
            type:cc.AudioClip,
            default:[]
        },

        sound:{
            type:cc.AudioClip,
            default:[]
        },    
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
             cc.audioEngine.play(this.sound[SoundName.CREATECARD], false,global.vol_sound);
         },this);
         this.node.on('dealcard',function(){
            cc.audioEngine.play(this.sound[SoundName.DEALCARD], false,global.vol_sound);
        },this);

        this.node.on('dice',function(){
            cc.audioEngine.play(this.sound[SoundName.DICE], false,global.vol_sound);
        },this);

        this.node.on('bet',function(){
            cc.audioEngine.play(this.sound[SoundName.BET], false,global.vol_sound);
        },this);

        this.node.on('clock',function(){
            cc.audioEngine.play(this.sound[SoundName.CLOCK], false,global.vol_sound);
        },this);


        if(global.bgmid==0)
            global.bgmid=cc.audioEngine.play(this.bgm[0], true, global.vol_music);
        
    },

    
});
