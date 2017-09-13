cc.Class({
    extends: cc.Component,

    properties: {
      head:cc.Sprite,
      nick:cc.Label,
      score:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setinfo',this.SetPlayerInfo,this);
    },

    SetPlayerInfo:function(event){
        //cc.log(event.detail);
        this.nick.string = event.detail.nick;
        this.score.string = event.detail.score;

        if(event.detail.head !== null){
            var that = this;            
            cc.loader.load({url: event.detail.head, type: 'jpg'}, function (err,tex) {               
                if(!err){                                 
                    that.head.SpriteFrame = new cc.SpriteFrame(tex);                    
                } 
            });
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
