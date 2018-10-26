cc.Class({
    extends: cc.Component,

    properties: {
        
       point:[cc.SpriteFrame],
       _pos:0,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('roll',function(event){
            this._pos = event.pos;
            this.node.x = event.x;
            this.node.y = event.y;
            //this.node.runAction(  cc.moveBy(1,-300,-100)); 
            if(event.id==1)
                this.node.runAction(  cc.moveTo(1,-30,30));   
            if(event.id==2)
                this.node.runAction(  cc.moveTo(1,30,-30));   
            this.node.getComponent(cc.Animation).play();       

        },this);

        this.node.on('rest',function(){
            this.node.x+=300; 
            this.node.y+=100;
            this.node.active = false;
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
