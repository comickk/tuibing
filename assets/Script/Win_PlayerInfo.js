cc.Class({
    extends: cc.Component,

    properties: {   
        playerline:cc.Prefab,
       
    },

    // use this for initialization
    onLoad: function () {
        //this.node.on('touchend',function(){event.stopPropagation();},this);  
        this.node.on('touchstart',function(){event.stopPropagation();},this);  
        this.node.on('popout',this.PopOut,this);
        this.node.on('popin',this.PopIn,this);        
        this.node.on('updateplayer',this.UpdatePlayer,this)
    },

    PopOut:function(){
        var act = cc.moveBy(0.4,this.node.width-5,0);
        this.node.runAction(act);

    },
    PopIn:function(){
        var act = cc.moveBy(0.4,-this.node.width+5,0);
        this.node.runAction(act);
    },

    UpdatePlayer:function(event){
        cc.log(event.detail);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
