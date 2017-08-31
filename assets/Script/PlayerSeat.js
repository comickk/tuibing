cc.Class({
    extends: cc.Component,

    properties: {
       head:cc.Sprite,
       nick:cc.Label,
       score:cc.Label,
       betnum:cc.Label,

       _seat:1,       
    },

    // use this for initialization
    onLoad: function () {

        this.betnum.node.active = false;

        this.node.on('clear',this.Clear,this);
        this.node.on('setplayerinfo',this.SetPlayerInfo,this);
        this.node.on('playerbet',this.PlayerBet,this);
    },

    Clear:function(){
        this.nick.string = '';
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
        this.betnum.node.active = true;
        this.betnum.string = event.detail.num;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
