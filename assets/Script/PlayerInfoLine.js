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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
