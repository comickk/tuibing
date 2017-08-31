var global = require('Global'); 
var GameStep = cc.Enum({
    WAIT:0,
    SELECTBANKER:-1,
    BET:-1,
    SHOW:-1,
});

cc.Class({
    extends: require("Controller"),

    properties: {
        imgs:[cc.SpriteFrame],
        point:[cc.SpriteFrame],
        chipimg:[cc.SpriteFrame],

        playerpoint:[cc.Sprite],
        pcard:cc.Prefab,
        chip:cc.Prefab,//筹码

        selfseat:cc.Node,
        seat:[cc.Node],
        timeprog:cc.ProgressBar,
        dice:[cc.Node],

        roomid:cc.Label,
        table:cc.Node,//桌面层
        chiplayer:cc.Node,//筹码层

        win_playerlist:cc.Node,


       _cards:[cc.Node],
       _cp:0,//牌 索引 指针

       _first:0,//当前发牌起始位

       _player:[],//游戏玩家

       _poplist :false,//是否弹出了玩家列表

       //---方位---
       _selfseat:0,

       _SELF:0,
       _LEFT:0,
       _TOP:0,
       _RIGHT:0,

       _chippool:cc.NodePool,
       //

       //是否有白板
       isHaveBan:true,
       
       //_canvas:cc.Canvas,       
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        // this._canvas = cc.Canvas.instance;

        this.roomid.string = '房间密码:'+ global.roominfo.group_id;

        //确定方位
        for(let i=0;i<global.playerinfo.length;i++){
            if(global.playerinfo[i].user_id == global.selfinfo.id){
                this._selfseat=global.playerinfo[i].seat; //
                break;            
        } }       

        this._SELF = this._selfseat;
        this._LEFT = ( (this._selfseat+1)%4==0)?4:(this._selfseat+1)%4;
        this._TOP =  ( (this._selfseat+2)%4==0)?4:(this._selfseat+2)%4;
        this._RIGHT =( (this._selfseat+3)%4==0)?4:(this._selfseat+3)%4;       

        cc.Canvas.instance.node.on('touchstart', this.Touch,this);
        //cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START,this.Touch,this)

        this.InitNodePool();
        
        global.socket.controller = this;
        this.UpdatePlayer(global.playerinfo);

        //自动举手
        //global.socket.SendMsg(5005);
    },
   
    onDestroy:function(){
        this._super();
        this._chippool.clear();
    },

    InitNodePool:function(){
        this._chippool = new cc.NodePool();

        for(let i=0;i<40;i++){
			let chip = cc.instantiate(this.chip);
			this._chippool.put(chip);	}
    },

    MsgHandle:function(data){
        cc.log(data);
        switch(data[0]){            
            //case 3002:    //创建一个房间
            case 3008:     //加入一个房间  
            case 3006:      //有人退出
                // 更新房间玩家信息
                if(data[3]==null )
                    cc.log('join room or exit room error!');
                else{
                    global.playerinfo = data[3][0];
                    global.roominfo = data[3][1];  
                    this.UpdatePlayer(global.playerinfo);
                }
            break;
        
            default:           
            break;          
        }        
    },

    //玩家下注
    PlayerBet:function(seat,num ){       
        //seat =1;
        var p0=null;
        var p1=null;
        switch(seat){
            case this._LEFT:
            p0 = this.seat[1].position;
            p1 = cc.v2(p0.x+200,p0.y-100);    
            this.seat[1].emit('playerbet',{num:num});               
            break;
            case this._TOP:
            p0 = this.seat[2].position;
            p1 = cc.v2(p0.x+200,p0.y-100); 
            this.seat[2].emit('playerbet',{num:num});    
            break;
            case this._RIGHT:
            p0 = this.seat[3].position;
            p1 = cc.v2(p0.x-200,p0.y-100); 
            this.seat[3].emit('playerbet',{num:num});    
            break;
            case this._SELF:
            p0 = this.selfseat.position;
            p1 = cc.v2(p0.x+100,p0.y+250); 
            this.selfseat.emit('playerbet',{num:num});    
            break;
        }
        if(p0 == null) return;
        
        
        var chip;
        if(this._chippool.size()>0)
			chip = this._chippool.get();
		else
            chip =cc.instantiate(this.chip);  

        
        chip.parent = this.chiplayer;
        chip.setPosition(p0);
        chip.runAction(cc.moveTo(0.4,p1));        
    },
    //资金结算，转移筹码
    Settlement:function(winner ,loser,num){

    },
    //回收筹码
    RecoveryChip:function(){
        var chips = this.chiplayer.children;
        for(let i =0;i<chips.length;i++){
            this._chippool.put(chips[i]); }
    },
    
    // update: function (dt) {

    // },

    //添加 玩家------------------
    AddPlayer:function(data){

    },
    //删除玩家
    DelPlayer:function(data){

    },

    UpdatePlayer:function(data){
        for(let i=1;i<4;i++)
            this.seat[1].emit('clear');

        for(let i=0;i<data.length;i++){
            switch(data[i].seat){
            case this._LEFT:                   
                this.seat[1].emit('setplayerinfo',{nick:data[i].user_name,score:0});
                break;
            case this._TOP:
                this.seat[2].emit('setplayerinfo',{nick:data[i].user_name,score:0});
                break;
            case this._RIGHT:
                this.seat[3].emit('setplayerinfo',{nick:data[i].user_name,score:0}); 
                break;    
            case this._SELF:
                this.selfseat.emit('setplayerinfo',{nick:data[i].user_name,score:0});
                break;              
            }            
        }

        this.win_playerlist.emit('updateplayer',{data:data});
    },

    //码牌-------------------
    CreatCard:function(){
        var x = -450;
        var y = -cc.Canvas.instance.node.height/2 +200;
        var num =40;
        if(!this.isHaveBan) num =36;

        x = -( 44*num/2  ) /2 +22;

        var i=0;
        // for(let i=0;i<num;i++){
        //     this._cards[i] = cc.instantiate(this.pcard);
        //     this._cards[i].parent = cc.Canvas.instance.node;

        //     if(i%2 ==0 ){
        //         x+=45;
		// 	    y-=16;

        //         this.scheduleOnce(function() { //---
        //             }, 0.25);
		// 	}		
		// 	else
		// 		y+=16;

        //     this._cards[i].x =x;
        //     this._cards[i].y =y;          
        // }

        this.schedule( function() {    
            this._cards[i] = cc.instantiate(this.pcard);
            this._cards[i].parent = this.table;           
            this._cards[i].x =x;
            this._cards[i++].y =y;    
           

            this._cards[i] = cc.instantiate(this.pcard);
            this._cards[i].parent = this.table;
            y+=16;
            this._cards[i].x =x;
            this._cards[i++].y =y;       

            x+=44;
			y-=16;     

        }, 0.1, num/2-1, 0);
    },
    //打骰子--------------------
    SetDice:function(d1,d2){        
 
        this.dice[0].active = this.dice[1].active = true;
      
       this.dice[0].emit('roll',{pos:3});
       this.dice[1].emit('roll',{pos:6});      
    },
    //设庄---------------------
    SetBanker:function(seat){

    },

    //等待下注
    WaitForBet:function(){
        this.SetTime(10);
    },

    //发牌------------------------
    Deal:function(first){
        first =1;
        var s=first;
        this._first = first;

        this.schedule( function() {               
            var y = this.seat[s-1].y-110;
            if(s == this._selfseat) y =this.seat[s-1].y;
            this._cards[this._cp++].emit('deal',{x:this.seat[s-1].x-22,y:y,seat:s});
            this._cards[this._cp++].emit('deal',{x:this.seat[s-1].x+22,y:y,seat:s});
            s++;
            if(s>4)s =1;
        }, 0.5, 3, 0);
    },
    //亮牌----------------------
    ShowCard:function(data){
        data = [1,2,3,4,5,6,7,8];
        //
        var p = this._cp-8;
        var x= -15;

        for(let i = 0;i<8;i++){

             if(i%2 ==0 )
                x= -15;
            else
                x= 15;
            this._cards[p++].emit('show',{img:this.imgs[data[i]],x:x});       
        }

        this.ShowPoint(data);

        this.scheduleOnce(function() {    
            this.Result();
        }, 3);
    },


    ShowPoint:function(data){
       // var p = this._cp-8;  
        var c1=0;
        var c2=0;      
        var point =0;
        for(let i = 0;i<8;i+=2){
            c1 = data[i];
            c2 = data[i+1]     

            if(c1 == c2)//对子
            {
                point = c1;
            }   
            else
            {
                point = (c1+c2)%10;
            }  

            //this.playerpoint[this._first].node.active = true;
            switch(this._first){
                case this._SELF:
                     this.playerpoint[this._SELF-1].node.active = true;
                     this.playerpoint[this._SELF-1].spriteFrame = this.point[point];
                break;
                case this._LEFT:
                     this.playerpoint[this._LEFT-1].node.active = true;
                     this.playerpoint[this._LEFT-1].spriteFrame = this.point[point];
                break;
                case this._TOP:
                     this.playerpoint[this._TOP-1].node.active = true;
                     this.playerpoint[this._TOP-1].spriteFrame = this.point[point];
                break;
                case this._RIGHT:
                     this.playerpoint[this._RIGHT-1].node.active = true;
                     this.playerpoint[this._RIGHT-1].spriteFrame = this.point[point];
                break;
            }

            this._first++;
            if(this._first>4)this._first =1;
        }
    },

    //结算----------------------
    Result:function(){
        console.log('------游戏结算--------');
    },
    //重置小回合--------------------圈
    NextGame:function(){
        var p = this._cp-8;
        for(let i = 0;i<8;i++){
             this._cards[p++].destroy();
        }

        for(let i = 0;i<4;i++){
             this.playerpoint[i].node.active = false;
        }


    },
    //重置大回合-------------------轮
    RestGame:function(){

    },
    //设置 计时器
    SetTime:function(timelen){
        this.timeprog.progress=0;

        timelen =10;
        this.schedule( function() {                         
          this.timeprog.progress+=1/timelen*0.2;           
        }, 0.2, timelen/0.2, 0);
    },

    Touch:function(event){
        //cc.log(event)
        if(!this._poplist) return;
        if(event.target.name == this.win_playerlist.name) return;

        this._poplist = false;
         this.win_playerlist.emit('popin');         
    },

    Btn_PlayerList:function(){
        if(this._poplist) return;
        this._poplist = true;
        this.win_playerlist.emit('popout');
    },

    Btn_Exit:function(){
        global.PopWinTip(1,'确定要退出吗？',this.ExitGame );       
    },

    Event_Back:function(){
         global.PopWinTip(1,'确定要退出吗？',this.ExitGame ); 
    },

    ExitGame:function(){      
        global.socket.SendMsg(3005);
        cc.director.loadScene('room'); 
    },

    CloseSocket:function(){
        cc.log('socket close');
    },
    //-----------------------
    TestBet:function(){
        this.PlayerBet(1,100);
        this.PlayerBet(2,100);
        this.PlayerBet(3,100);
        this.PlayerBet(4,100);
    },
});
