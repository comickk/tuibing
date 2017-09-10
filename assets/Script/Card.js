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

       _isshow:false,
       _offx:0,
       _cardimg:cc.spriteFrame,
    }, 

    // use this for initialization
    onLoad: function () {
        this.node.on('deal',function(event){
           // this._seat = event.detail.seat;
            this._offx = event.detail.offx;
            var len = cc.pDistance(this.node.position,cc.v2(event.detail.x,event.detail.y))/700;
            if(event.detail.spf != null){
                this._isshow = true;
                this._cardimg = event.detail.spf;
                var ShowCard = cc.callFunc( function(){
                    this.getComponent(cc.Sprite).spriteFrame = this._cardimg;
                    this.node.x += this._offx;
                },this );
                this.node.runAction(  cc.sequence( cc.moveTo(len,event.detail.x,event.detail.y),
                                                   cc.delayTime(1),
                                                    ShowCard     ));     
            }
            else
                this.node.runAction(  cc.moveTo(len,event.detail.x,event.detail.y));             
        },this);

        this.node.on('show',function(event){
            if(this._isshow) return;
            this._isshow = true;
            this.getComponent(cc.Sprite).spriteFrame = event.detail.img;
            this.node.x += event.detail.x;
        },this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
