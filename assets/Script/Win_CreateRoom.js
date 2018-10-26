
var global = require('Global'); 
cc.Class({
    extends: require("PopWin"),

    properties: {
        roomname:cc.EditBox,//房间名
        maxmember:cc.Label,//参与人数
        roundmark:cc.Node,
        fund:cc.EditBox,//组局基金
        fund_tip:cc.Node,

        daikai:cc.Toggle,//代开开关
        _daikai:false,

        _membernum:4,//会员人数
        _maxround:1,//最大圈数
    },

    // use this for initialization
    onLoad: function () {
        this._super();

    },

    onEnable:function(){
        this._super();
        var nick ='';       
       
        if(global.selfinfo != null)
            nick = global.selfinfo.nickname;
        
        if(nick.length >7)
            nick = nick.slice(0,7);

        this.roomname.string =  nick +'的房间';
        this.maxmember.string = '';
        this.maxmember.string = this._membernum;
        this.fund.string = '';

        //如果是会员，开启代开功能
        //if()
        //    this.daikai.active = true;
    },

    Btn_Round:function(event,customEventData){
        this._maxround =  Number(customEventData);
        this.roundmark.x = -240+(this._maxround-1)*160;      
    },

    Btn_MemberNum:function(event,customEventData){     
        var n =  Number(customEventData);
        if(this._membernum + n> 10 || this._membernum+n < 4) return;

        this._membernum +=n;         
        this.maxmember.string = this._membernum+'';
    },

    Btn_FundTip:function(){
        this.fund_tip.active = true;
        this.scheduleOnce(function(){
            this.fund_tip.active = false;
        },5);
    },

    Btn_Start:function(){  
        
        if(this.fund.string =='')
            this.fund.string ='0';       
      //cc.log(this.roomname.string)
        var data =   JSON.stringify({
              name: this.roomname.string,
              visitor_count: this._membernum-4,  // n个钓鱼人
              round_count:  this._maxround,  // n圈              
              fund: Number(this.fund.string),  // 组局基金
        });          

        if(this._daikai)
            require('Global').socket.SendMsg(3009,data); 
        else
            require('Global').socket.SendMsg(3001,data);      
        
    },

    IsDaiKai:function(){
        this._daikai = !this._daikai;
    },
});
