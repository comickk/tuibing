cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        nick:cc.Label,       
        gold:cc.Label,//元宝
        score:cc.Label,

       // defaultimg:cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('setinfo',function(event){
            
            var data = event.detail.data;
            
            cc.log(data);
            if(data.id.length<28){
                //不是微信号
            }else{
                this.GetHeadImg(this.head,data.id);
                //this.head
            }

            if(data.id == require('Global').selfinfo.id)
                this.node.color = new cc.Color(255, 202, 109);

            this.nick.string = data.nick;
            this.gold.string = data.gold;
            this.score.string = data.score;

        },this);

    },

    GetHeadImg:function(sprite,id){        
        var self = this;       
        var remoteUrl ="http://"+require('Global').socket.URL+"/client/user/avatar?id="+id;
        var frame= null;
        cc.loader.load({url: remoteUrl, type: 'jpg'}, function (err,tex) {          
            if(!err){                
                sprite.spriteFrame = new cc.SpriteFrame(tex);                
            }
        });        
    }
});
