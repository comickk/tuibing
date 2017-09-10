var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {

        bgm:[cc.AudioClip],
       
    },

    // use this for initialization
    onLoad: function () {
        global.ac = this.node;
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

       
        // this.node.on('fire',function(){
        //     cc.audioEngine.play(this.gun[0], false,global.volume);
        // },this);

        
    },

    
});
