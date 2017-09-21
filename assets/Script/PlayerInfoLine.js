cc.Class({
    extends: cc.Component,

    properties: {
      head:cc.Sprite,
      nick:cc.Label,
      score:cc.Label,

      _headimg:cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setinfo',this.SetPlayerInfo,this);
    },

    SetPlayerInfo:function(event){
        //cc.log(event.detail);
        this.nick.string = event.detail.nick;
        this.score.string = event.detail.score;


        if(event.detail.head != null)
            this.head.spriteFrame = event.detail.head;
         //头像
        //  if(this._headimg == null && event.detail.head !== null){
        //     this.head.node.active = true;
        //     var headurl = "http://"+ require('Global').socket.URL+"/client/user/avatar?id="+event.detail.head;

        //     var that = this;            
           
        //     cc.loader.load({url:headurl, type: 'jpg'}, function (err,tex) {                        
        //         if(!err){                                     
        //             that._headimg = new cc.SpriteFrame(tex);
        //             that.head.spriteFrame = that._headimg;
        //         } 
        //     });
        // }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
