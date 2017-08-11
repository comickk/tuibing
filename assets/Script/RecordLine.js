cc.Class({
    extends: cc.Component,

    properties: {
       time:cc.Label,
       score:cc.Label,
       players:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setrecord',this.SetRecord,this);
    },

    SetRecord:function(event){
        cc.log(event.detail);
    }
    
});
