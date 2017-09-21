
var global = require('Global'); 
cc.Class({
    extends: require("PopWin"),

    properties: {
       layout:cc.Node,
       timebar:cc.ProgressBar,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setfisherbet',function(event){

            var bankerbet = event.detail.bankerbet;
            var bankerseat = event.detail.bankerseat;

            var timelen = event.detail.len;

            var fisherbet = this.layout.children;
            var j=0;
            for(let i in global.playerinfo){ 
                if(global.playerinfo[i].seat ==  bankerseat)
                    continue;
                if(global.playerinfo[i].seat >0 && global.playerinfo[i].seat <5){    

                    fisherbet[j].emit('setfisherbet',{  bankerbet:bankerbet,
                                                        nick:global.playerinfo[i].nick,
                                                        seat:global.playerinfo[i].seat,
                                                        head:global.playerinfo[i].headimg});

                    j++;
                    if(j>3) return;
                }
            }
           
            //设置 时间
            this.timebar.progress=0;

            this.schedule( function() {                         
                this.timebar.progress+=1/timelen*0.2;    
                if(this.timebar.progress >= 1)
                    this.Btn_Cancel();
            }, 0.2, timelen/0.2, 0);

        },this);

       // this.node.emit('setfisherbet',{bankerbet:1000,bankerseat:4,timelen:50});
    },


    Btn_OK:function(){

        //取出下注值 
        var bet = [0,0,0,0,0];
        var fisherbet = this.layout.children;
        
        for(let i in fisherbet){
            var com = fisherbet[i].getComponent('FishBetLine');                        
            bet[com._myseat] = com._mybet; 
        }

        var isnull= true;

        for(let i in bet)
            if(bet[i] >0 ){ isnull = false;break;}

        if(!isnull)
            global.socket.SendMsg(5009,JSON.stringify( bet));   
        
            this.unscheduleAllCallbacks();      
        this.Hide();
    },

    Btn_Cancel:function(){
        this.unscheduleAllCallbacks();
        this.Hide();        
    },
    
});
