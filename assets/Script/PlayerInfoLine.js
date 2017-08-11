cc.Class({
    extends: cc.Component,

    properties: {
      head:cc.Sprite,
      nick:cc.Label,
      score:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setinof',this.SetPlayerInfo,this);
    },

    SetPlayerInfo:function(event){
        cc.log(event.detail);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
