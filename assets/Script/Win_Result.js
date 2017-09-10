cc.Class({
    extends: require("PopWin"),

    properties: {
      
        game :cc.Node,
      timebar:cc.ProgressBar,
      resultline:cc.Prefab,
      layout:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.node.on('setscore',this.SetScore,this);
    },   

    SetScore:function(event){
        var score = event.detail.score;
        for(let i=0;i<score.length;i++){         
            var line = cc.instantiate(this.resultline);
            line.parent = this.layout;
            line.setPosition(0,0);
            line.emit('setresult',{score:score[i]});}

        var timelen =10;
        this.timebar.progress=0;
        this.schedule( function() {                         
            this.timebar.progress+=1/timelen*0.2;    
            if(this.timebar.progress >= 1)
                this.Btn_Continue();
        }, 0.2, timelen/0.2, 0);
    },

    Btn_Continue:function(){
       
        this.unscheduleAllCallbacks();
        this.layout.removeAllChildren();
        this.game.emit('nextgame');
        this.Hide();
    },
    Btn_Exit:function(){
        
        this.unscheduleAllCallbacks();
        this.layout.removeAllChildren();
        this.game.emit('nextgame');
        this.Hide();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
