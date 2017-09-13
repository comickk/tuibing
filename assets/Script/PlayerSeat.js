cc.Class({
    extends: cc.Component,

    properties: {
       head:cc.Sprite,
       nick:cc.Label,
       score:cc.Label,
       betnum:cc.Label,

       _seat:1,    
       _betstr:'',   
    },

    // use this for initialization
    onLoad: function () {

        this.betnum.node.active = false;

        this.node.on('clear',this.Clear,this);
        this.node.on('setplayerinfo',this.SetPlayerInfo,this);
        this.node.on('playerbet',this.PlayerBet,this);
        this.node.on('bankerbet',this.BankerBet,this);
        this.node.on('clearbet',this.ClearBet,this);
        this.node.on('setbetnum',function(event){  
            this.betnum.string = this._betstr+Number(event.detail.num-0);
        },this);
    },

    Clear:function(){
        this.nick.string = '等待加入';
        this.score.string = '';
    },
    SetPlayerInfo:function(event){
        //cc.log(event.detail);
        var msg = event.detail;
        
        this.nick.string = msg.nick;
        this.score.string = msg.score;

        //头像
        if(event.detail.head !== null){
            this.head.node.active = true;
            var that = this;   
            
            cc.loader.load({url: event.detail.head, type: 'jpg'}, function (err,tex) {               
                if(!err){                      
                    that.head.SpriteFrame = new cc.SpriteFrame(tex);                    
                } 
            });
        }
    },

    PlayerBet:function(event){
        this._betstr = '';
        this.betnum.node.active = true;
        this.betnum.string = event.detail.num;
    },
    BankerBet:function(event){
        this._betstr = '锅底:';
        this.betnum.node.active = true;
        this.betnum.string = this._betstr + Number(event.detail.num-0);
    },
    ClearBet:function(){
        this.betnum.node.active = false;
        this.betnum.string = '';
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
