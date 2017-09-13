cc.Class({
    extends: require("PopWin"),

    properties: {
        game:cc.Node,
        timer:cc.Label,
        _timelen:10,
    },

    // use this for initialization
    onEnable:function(){
        this._super();
        this._timelen =10 ;

        this.schedule(function(){
            this.timer.string = this._timelen--;
            if(this._timelen < 0) 
                this.TimeOut();
        },1,10,0);
    },

    Btn_Continue:function(){

        this.unscheduleAllCallbacks();
        this.game.emit('bankercontinue');
        this.Hide();
    },

    Btn_Exit:function(){

        this.unscheduleAllCallbacks();

        this.game.emit('bankerexit');
        //require('Global').socket.SendMsg(5071,0);//回复是否续庄
        this.Hide();
    },

    TimeOut:function(){

        this.Hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
