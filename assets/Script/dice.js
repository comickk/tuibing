cc.Class({
    extends: cc.Component,

    properties: {
        
       point:[cc.SpriteFrame],
       _pos:0,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('roll',function(event){
            this._pos = event.detail.pos;
            this.node.runAction(  cc.moveBy(1,-300,-100));          

        },this);
    },

    ShowPoint:function(){       
        var anim = this.getComponent(cc.Animation);
        anim.stop();

        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.point[this._pos];
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
