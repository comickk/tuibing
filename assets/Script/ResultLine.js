cc.Class({
    extends: cc.Component,

    properties: {
        nick:cc.Label,
        point:cc.Label,
        gold:cc.Label,//元宝
        score:cc.Label,
       
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setresult',this.SetResult,this);
    },

    SetResult:function(event){
        cc.log(event.detail);
    },

    
});
