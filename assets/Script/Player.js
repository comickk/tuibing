/*
玩家数据

----生涯----    
总场次
当庄数
钓鱼数    

----盈利统计----
比赛盈利      钓鱼盈利

盈利历史（7天 30天  总和）
战绩记录




*/


cc.Class({
    extends: cc.Component,

    properties: {
        _playername:'',
        _glod:0,
        _seat:0,
        _isbanker:false,

        _card:[],       
    },

    // use this for initialization
    onLoad: function () {
        this._card[0]=this._card[1] =0;

        // this.node.on('deal',function(event){
        //     this._card[0] = event.detail.c1;
        //     this._card[1] = event.detail.c2;
        // },this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
