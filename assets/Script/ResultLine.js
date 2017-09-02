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
       // cc.log(event.detail);
        var score = event.detail.score;
        this.nick.string = score.nick;
        this.gold.string = score.gold;
        this.score.string = score.score;
        var point=0;
        if(score.card[0] == score.card[1])//对子       
            point = '对'+score.card[0] ;       
        else        
            point = (score.card[0]+score.card[1])%10 + '点';

        this.point.string = point;         
    },

    
});
