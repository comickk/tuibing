var CardType = cc.Enum({
    HEAP:1,
    BACK:-1,
    SHOW:-1,
    HIDE:-1,
});
var CardSeat =cc.Enum({
    TABLE:0,
    SELF:-1,
    LEFT:-1,
    TOP:-1,
    RIGHT:-1,
    BANK:-1
});

// var CardValue = cc.Enum({
    
// });

cc.Class({
    extends: cc.Component,

    properties: {
       
       _type:CardType.HEAP,
       _seat:CardSeat.TABLE,       
       _value:0,        
    }, 

    // use this for initialization
    onLoad: function () {
        this.node.on('deal',function(event){
            this._seat = event.detail.seat;
            this.node.runAction(  cc.moveTo(0.8,event.detail.x,event.detail.y)); 
        },this);

        this.node.on('show',function(event){
            this.getComponent(cc.Sprite).spriteFrame = event.detail.img;
            this.node.x += event.detail.x;
        },this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
