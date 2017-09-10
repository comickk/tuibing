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
            this.betnum.string = this._betstr+event.detail.num;
        },this);
    },

    Clear:function(){
        this.nick.string = '等待加入';
        this.score.string = '';
    },
    SetPlayerInfo:function(event){
        //cc.log(event.detail);
        var msg = event.detail;
        //头像
        //
        this.nick.string = msg.nick;
        this.score.string = msg.score;
    },

    PlayerBet:function(event){
        this._betstr = '';
        this.betnum.node.active = true;
        this.betnum.string = event.detail.num;
    },
    BankerBet:function(event){
        this._betstr = '锅底:';
        this.betnum.node.active = true;
        this.betnum.string = this._betstr + event.detail.num;
    },
    ClearBet:function(){
        this.betnum.node.active = false;
        this.betnum.string = '';
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
