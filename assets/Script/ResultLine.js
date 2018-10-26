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
        var score = event.score;
        this.nick.string = score.nick;
       
        this.score.string = score.score_count;

        this.gold.string = score.fund;//gold 显示组局基金

        // if( score.fund-0 > 0)
        //    this.score.string +='('+ score.fund +')';

        if(!cc.isValid(score.card)) return;

        var point=0;
        if(score.card[0] == score.card[1])//对子       
            point = '对'+score.card[0] ;       
        else        
            point = (score.card[0]+score.card[1])%10 + '点';

        this.point.string = point;         
    },

    
});
