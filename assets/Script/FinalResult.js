cc.Class({
    extends: cc.Component,

    properties: {
      
        line:cc.Prefab,

        roomname:cc.Label,
        fund:cc.Label,
        roomid:cc.Label,

        playerlist:cc.Node,
        fisher:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        //this.roomname.string =  '房间名称:'+require('Global').roominfo.name;
        this.fund.string =  require('Global').roominfo.fund;
        this.roomid.string = require('Global').roominfo.id;

        this.node.on('setresult',this.SetResult,this);
       
    },

    SetResult:function(event){
        var data = event.data;

        for(let i in data){
            var p = cc.instantiate(this.line);            
            if(data[i].seat>0){
                p.parent =this.playerlist;
            }else{
                p.parent = this.fisher;
            }

            p.setPosition(0,0);
            p.emit('setinfo',{data:data[i]});

        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
