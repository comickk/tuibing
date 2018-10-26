cc.Class({
    extends: cc.Component,

    properties: {
       head:cc.Sprite,
       nick:cc.Label,
       score:cc.Label,
       betnum:cc.Label,
       fisher_betnum:cc.Label,

        offline:cc.Node,

       _headimg:cc.SpriteFrame,
       _seat:1,    
       _betstr:'',   

       _fisher_bet:[],
    },

    // use this for initialization
    onLoad: function () {

        //this.betnum.node.active = false;
        this.node.on('clear',this.Clear,this);
        this.node.on('setplayerinfo',this.SetPlayerInfo,this);
        this.node.on('playerbet',this.PlayerBet,this);
        this.node.on('bankerbet',this.BankerBet,this);
        this.node.on('clearbet',this.ClearBet,this);

        this.node.on('setbetnum',function(event){  
            cc.log('setbetnum 方法已取消');
            // if(event.detail.seat >0)
            //     this.betnum.string = this._betstr+Number(event.detail.num-0);
            // else{
            //     for(let i in this._fisher_bet){
            //         if(this._fisher_bet[i] == event.detail.num-0)

            //         this.fisher_betnum.string += this._fisher_bet[i];
            //         this.fisher_betnum.string +='\r\n';                
            //     }
            // }
        },this);

        this.node.on('updatebetnum',function(){  
            var global = require('Global'); 

            this.fisher_betnum.string ='';
            this.betnum.string ='';

            var allfisherbet =0;

            for(let i in global.playerinfo){
                if(global.playerinfo[i].bet[this._seat] >0 ){
                    if(global.playerinfo[i].seat >0)
                        this.betnum.string = global.playerinfo[i].bet[this._seat];
                    else{                        
                        allfisherbet+=global.playerinfo[i].bet[this._seat];
                    }
                }
            }
            if(allfisherbet>0)
                this.fisher_betnum.string = allfisherbet;

        },this);
        
       
        this._headimg = null;

        this.betnum.string ='';
        this.fisher_betnum.string ='';
        this.head.node.opacity = 0; 
    },

    Clear:function(){
        this.nick.string = '等待加入';
        this.score.string = '';
        this.head.node.opacity = 0;
    },
    SetPlayerInfo:function(event){       
       
        var msg = event;
        
        this.nick.string = msg.nick;
        this.score.string = msg.score;

        this._seat = msg.seat;

        //头像
        //this.head.node.active = true;
        this.head.node.opacity = 255;
        
        if(msg.head !== null){             
            this.head.spriteFrame = msg.head;
        }

        if(!msg.online && cc.isValid(this.offline))
            this.offline.opacity = 255;

        // if(this._headimg == null && msg.head !== null){
        //     this.head.node.active = true;
        //     var headurl = "http://"+ require('Global').socket.URL+"/client/user/avatar?id="+msg.head;

        //     var that = this;               
           
        //     cc.loader.load({url:headurl, type: 'jpg'}, function (err,tex) {                        
        //         if(!err){                                     
        //             that._headimg = new cc.SpriteFrame(tex);                       
        //             that.head.spriteFrame = that._headimg;                    
        //         } 
        //     });
        // }
    },

    PlayerBet:function(event){
        cc.log('play bet 方法已取消');
        // this._betstr = '';
        // var seat = event.detail.seat;
        // if(seat >0 && seat < 5){
        //     //this.betnum.node.active = true;
        //     this.betnum.string = event.detail.num;      
        // }else{
        //     this._fisher_bet.push(event.detail.num-0);
        //     this.fisher_betnum.string ='';
        //     for(let i in this._fisher_bet){
        //         this.fisher_betnum.string += this._fisher_bet[i];
        //         this.fisher_betnum.string +='\r\n';                
        //     }
        // }
    },
    BankerBet:function(event){
        this._betstr = '锅底:';
        //this.betnum.node.active = true;
        this.betnum.string = this._betstr + Number(event.num-0);
    },
    ClearBet:function(){
        //this.betnum.node.active = false;
        this.betnum.string ='';
        this.fisher_betnum.string ='';
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
