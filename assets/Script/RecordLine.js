cc.Class({
    extends: cc.Component,

    properties: {
       time:cc.Label,
       score:cc.Label,
       players:cc.Node,

       defaultimg:cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setrecord',this.SetRecord,this);
    },

    SetRecord:function(event){
        
        //line   2017-8-19  id1  id2  id3   id4  id5   ……………………  1000
       // cc.log(event.detail);
        var data= event.data;
        
        //写时间
        this.time.string = data[0];
        //写分数
        this.score.string = data[data.length-1];
        
        //画头像
        for(let i=1;i<data.length-1;i++){
            //创建头像
            var head = new cc.Node();
            head.parent = this.players;
            head.setPosition(0,0);
            head.width = head.height =50;
            var img =head.addComponent(cc.Sprite); 
            img.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            
            //"http://"+global.socket.URL+"/client/user/avatar?id="+id;
            if(data[i].length< 28){
                //不是 WX ID
                img.spriteFrame = this.defaultimg;
            }else{
                this.GetHeadImg(img,data[i]);
            }
        }
       
    },

    GetHeadImg:function(sprite,id){        
        var self = this;
        //var remoteUrl = "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoDA8HqHL3ZNz3jcQhf6aAryIdZ1j8Bh75TPTpoScMpODMsBa3mVBbQGDFxoajZiaF2JV9p8JHQXBQ/0.jpg";
        var remoteUrl ="http://"+require('Global').socket.URL+"/client/user/avatar?id="+id;
        var frame= null;
        cc.loader.load({url: remoteUrl, type: 'jpg'}, function (err,tex) {          
            if(!err){                
                sprite.spriteFrame = new cc.SpriteFrame(tex);                
            }
        });        
    }
    
});
