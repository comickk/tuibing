cc.Class({
    extends: require("PopWin"),

    properties: {
       graphics:cc.Graphics,
       recordlist:cc.ScrollView,
       recordline:cc.Prefab,

       _gw:10,
       _gh:10,
    },

    // use this for initialization
    onLoad: function () {

        this._gw = this.graphics.node.width-8;
        this._gh = this.graphics.node.height-8;
        this.DrawRecord();
    },

    DrawRecord:function(){
        this.graphics.moveTo(4,4);
        for(let i=0;i<=20;i++){
            this.graphics.lineTo( 4+this._gw/20*i,cc.random0To1()*this._gh  );
        }     
        this.graphics.stroke();
    },
});
