cc.Class({
    extends: cc.Component,

    properties: {
        bankbet:cc.Node,
        playerbet:cc.Node,

        betnum:cc.Label,
        betslider:cc.Slider,

        _type:1,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    SetBetNum:function(){
        this.betnum.string = Math.round(100*this.betslider.progress);
    }
});
