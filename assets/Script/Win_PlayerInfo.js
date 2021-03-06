cc.Class({
    extends: cc.Component,

    properties: {   
        playerline:cc.Prefab,
        playerlist:cc.Node,
       
        fund:cc.Label,

        roundnum:cc.Label,
        playernum:cc.Label,
        roomname:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        //this.node.on('touchend',function(){event.stopPropagation();},this);  
        this.node.on('touchstart',function(){event.stopPropagation();},this);  
        this.node.on('popout',this.PopOut,this);
        this.node.on('popin',this.PopIn,this);        
        this.node.on('updateplayer',this.UpdatePlayer,this);

        this.fund.string = '0 / '+require('Global').roominfo.fund;      
        this.roundnum.string = '最大圈数:'+require('Global').roominfo.round_count;
        this.playernum.string = '钓鱼人数:'+require('Global').roominfo.visitor_count;
        this.roomname.string =  '房间名称:'+require('Global').roominfo.name;
    },

    PopOut:function(){
        var act = cc.moveBy(0.4,this.node.width-5,0);
        this.node.runAction(act);

    },
    PopIn:function(){
        var act = cc.moveBy(0.4,-this.node.width+5,0);
        this.node.runAction(act);
    },

    UpdatePlayer:function(event){
        
       // cc.log(event.detail);
        var data =event.data;
        //clear
        if(this.playerlist.childrenCount >0){
            //var list =this.playerlist.children;
            this.playerlist.removeAllChildren();
        }
        //update
        for(let i=0;i<data.length;i++){       
           
            var line = cc.instantiate(this.playerline);
            line.parent = this.playerlist;
            line.setPosition(0,0);

           // if(!cc.isValid( data[i].headurl))
            //    line.emit('setinfo',{nick:data[i].nick,score:data[i].score,head:null}); 
            //else
                line.emit('setinfo',{nick:data[i].nick,score:data[i].score,head:data[i].headimg});           
        }

        this.fund.string = require('Global').roominfo.curr_fund +'/'+require('Global').roominfo.fund;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
