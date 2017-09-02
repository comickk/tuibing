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
        timetip:cc.Label,

        btndice:cc.Node,
        dice:[cc.Node],

        roomid:cc.Label,
        table:cc.Node,//桌面层
        chiplayer:cc.Node,//筹码层

        win_result:cc.Node,
        win_playerlist:cc.Node,
        btn_bar:cc.Node,
        banker:cc.Node,


       _cards:[cc.Node],
       _cp:0,//牌 索引 指针

       _first:0,//当前发牌起始位

       _player:[],//游戏玩家

       _poplist :false,//是否弹出了玩家列表

       //---方位---
       _banker:0,
       _selfseat:0,

       _SELF:0,
       _LEFT:0,
       _TOP:0,
       _RIGHT:0,

       _chippool:cc.NodePool,
       //
        _count:0,
        _count1:0,

        _status:0,
        _round:0,

        _bankerbet:0,//锅底数
       //是否有白板
       isHaveBan:true,
       
       //_canvas:cc.Canvas,       
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        // this._canvas = cc.Canvas.instance;

       // this.roomid.string = '房间密码:'+ global.roominfo.group_id;
        if(cc.isValid(global.playerinfo)){
            this.roomid.string = '房间密码:'+  global.playerinfo[0].group_id;
        
            //确定方位       
            for(let i in global.playerinfo){
                if(global.playerinfo[i].id == global.selfinfo.id){
                    this._selfseat= this.SeatTran(global.playerinfo[i].seat); //
                    break;            
            } }       
        }else
            this._SELF = this._selfseat = 3;

        this._SELF = this._selfseat;
        this._LEFT = ( (this._selfseat+1)%4==0)?4:(this._selfseat+1)%4;
        this._TOP =  ( (this._selfseat+2)%4==0)?4:(this._selfseat+2)%4;
        this._RIGHT =( (this._selfseat+3)%4==0)?4:(this._selfseat+3)%4;       

        if(cc.isValid(global.playerinfo))
            this.UpdatePlayer(global.playerinfo);

        cc.Canvas.instance.node.on('touchstart', this.Touch,this);
        this.node.on('nextgame',this.NextGame,this);
        //cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START,this.Touch,this)

        this.InitNodePool();

        //自动举手
        if(cc.isValid(global.socket)){
            global.socket.controller = this;
            global.socket.SendMsg(5005);
        }
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
                this.AddPlayer(data[3]);
                this.UpdatePlayer(global.playerinfo);
            break;
            case 3006:      //有人退出
                this.DelPlayer(data[3].id);
                this.UpdatePlayer(global.playerinfo);
                // 更新房间玩家信息
                // if(data[3]==null )
                //     cc.log('join room or exit room error!');
                // else{
                //     global.playerinfo = data[3][0];
                //     global.roominfo = data[3][1];  
                //     this.UpdatePlayer(global.playerinfo);
                // }
            break;

            case 5006://玩家已准备                
                if(data[3].act_status==1 && data[3].ready_count ==4)  
                    this.WaitForSelectBanker(data[3].user_seat);   
            break;

            case 5014://玩家打色子比大小选庄
                
                var seat =data[3].user_seat;
                var last = seat;
                switch(seat){
                    case 2:last =1;break;
                    case 4:last =2;break;
                    case 8:last =4;break;
                    case 1:last =8;break;
                }

                var dice =data[3].craps_result[ last ]; 
               
                this.SetDice(dice[0],dice[1]);

                this.scheduleOnce(function() {
                    this.dice[0].emit('rest');
                    this.dice[1].emit('rest');

                    if(data[3].act_status==2)                      
                       this.SetBanker(data[3].user_seat_banker);
                    else
                        this.WaitForSelectBanker(data[3].user_seat);  
                }, 3);              
                
            break;

            case 5016://庄选先起牌位
                //this._first = this.SeatTran( data[3].round_no_first_user_seat);
                this._first = data[3].round_no_first_user_seat;
                this.SetDice(data[3].user_seat_banker_craps[0],data[3].user_seat_banker_craps[1]);

                this.scheduleOnce( function(){
                    this.dice[0].emit('rest');
                    this.dice[1].emit('rest');
                    this.WaitForPlayerBet();},3);                
            break;

            case 5018://庄下底
                //data.users["id"].bet
                var bankerid='';
                for(let i in global.playerinfo){
                    if(this._banker == this.SeatTran( global.playerinfo[i].seat )){
                        bankerid = global.playerinfo[i].id;
                        break;}}

                this._status=1;
                var bet = data[3].users[bankerid].bet+0;
                this._bankerbet = bet;
                this.PlayerBet(this._banker,bet);
               
                this.scheduleOnce( this.WaitForBankerDice,1);                

            break;

            case 5020://闲下注
               
                for(let i in data[3].users){
                    if(data[3].user_seat_2 == data[3].users[i].seat){
                        this.PlayerBet( this.SeatTran( data[3].user_seat_2),data[3].users[i].bet-0);
                        break;}}

                if(data[3].act_status==5){
                    this.StopTimer();
                    this.Deal();  }
            break;

            case 5022://亮牌结算
                
                var res = [0,0,0,0];
                for(let i=0;i<4;i++){
                    for(let j in data[3].users){
                       if( i+1 == this.SeatTran( data[3].users[j].seat)){
                           res[i] = data[3].users[j].bet2 - data[3].users[j].bet;
                           break;}}}

                this.ShowCard(data[3].pai8,res);
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
        chip.tag = seat;
        chip.runAction(cc.moveTo(0.4,p1));        
    },
    //资金结算，转移筹码
    Settlement:function(winner ,loser,num){

    },
    //回收筹码
    RecoveryChip:function(){
        var chips = this.chiplayer.children;          

        var l = chips.length;
        var j=0;
        for(let i=0;i<l;i++){
            if(chips[j].tag != this._banker)   
                this._chippool.put(chips[j]); 
            else j++;  }
      

        for(let i=1;i<=4;i++){
            if(i== this._banker) continue;
            switch(i){
                case this._SELF:this.selfseat.emit('clearbet');break;
                case this._LEFT:this.seat[1].emit('clearbet');break;
                case this._TOP:this.seat[2].emit('clearbet');break;
                case this._RIGHT:this.seat[3].emit('clearbet');break;
            }}
    },
    
    // update: function (dt) {

    // },

    //添加 玩家------------------
    AddPlayer:function(data){
        for(let i in data){
            var ishave = false;
            for(let j in global.playerinfo)
                if(data[i].id == global.playerinfo[j].id) {
                    ishave = true;
                    break;}

            if(!ishave) global.playerinfo.push(data[i]);}        
    },
    //删除玩家
    DelPlayer:function(id){
        for(let j in global.playerinfo)
            if(id == global.playerinfo[j].id) {
                global.playerinfo.splice(j,1);
                break;}
    },

    UpdatePlayer:function(data){
        for(let i=1;i<4;i++)
            this.seat[i].emit('clear');

        for(let i in data){
            var score =0;
            if(cc.isValid(data[i].score))
                score = data[i].score;
            switch( this.SeatTran( data[i].seat)){
            case this._LEFT:                   
                this.seat[1].emit('setplayerinfo',{nick:data[i].nickname,score:score});
                break;
            case this._TOP:
                this.seat[2].emit('setplayerinfo',{nick:data[i].nickname,score:score});
                break;
            case this._RIGHT:
                this.seat[3].emit('setplayerinfo',{nick:data[i].nickname,score:score}); 
                break;    
            case this._SELF:
                this.selfseat.emit('setplayerinfo',{nick:data[i].nickname,score:score});
                break;              
            }}

        this.win_playerlist.emit('updateplayer',{data:data});
    },

    //===============================================================//
    //-------------------------游戏步骤-------------------------------//
    //===============================================================//

    WaitForSelectBanker:function(seat){

        if(this._selfseat == this.SeatTran(seat)){
            this.btndice.active = true;
            this.StartTimer(10,'请掷骰子选庄',this.TimeOut_Dice);
        }else
            this.StartTimer(10,'等待玩家掷骰子选庄');            
    },
    WaitForBankerBet:function(){
        if(this._selfseat == this._banker ){  
            this.btn_bar.emit('showbankerbtn');        
            this.StartTimer(10,'请选择您要设的锅底数',this.TimeOut_Bet); 
        }else
            this.StartTimer(10,'等待庄家下锅底');  
    },
    WaitForBankerDice:function(){
        if(this._selfseat == this._banker ){
            this.btndice.active = true;   
            this.StartTimer(10,'请掷骰子决定首先揭牌的玩家座位',this.TimeOut_Dice); 
        }else
            this.StartTimer(10,'等待庄家掷骰子决定首先揭牌的玩家座位');  
    },
    WaitForPlayerBet:function(){

        if(this._selfseat == this._banker )          
            this.StartTimer(10,'等待闲家下注'); 
        else{
            this.btn_bar.emit('showbtn',{bet:this._bankerbet});
            this.StartTimer(10,'请下注',this.TimeOut_Bet);}
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
            
            if(i>=36  )                   
                this.WaitForBankerBet();                 
            
        }, 0.1, num/2-1, 0);
    },

    //打骰子--------------------
    SetDice:function(d1,d2){        
       
        this.dice[0].active = this.dice[1].active = true;
      
       this.dice[0].emit('roll',{pos:d1});
       this.dice[1].emit('roll',{pos:d2});      
    },
    //设庄---------------------
    SetBanker:function(seat){
        this._banker= this.SeatTran(seat);

        this.banker.active = true;

        switch(this._banker){
            case this._SELF: this.banker.setPosition(this.selfseat.x-85,this.selfseat.y+90); ;break;
            case this._LEFT:this.banker.setPosition(this.seat[1].x-75,this.seat[1].y+80);break;
            case this._TOP:this.banker.setPosition(this.seat[2].x-155,this.seat[2].y);break;
            case this._RIGHT:this.banker.setPosition(this.seat[3].x+75,this.seat[3].y+80);break;
        }  

        this.CreatCard();
    },   

    //发牌------------------------
    Deal:function(){
        //first =1;
        var s= this._first;
        //s=1;
        //this._first = first;
       
        this.schedule( function() {     
            var pos=null;
            switch(s){
                case this._SELF:  
                    pos = this.seat[0].position; 
                break;
                case this._LEFT:  
                    pos = this.seat[1].position;
                    pos.y-=110;
                    break;
                case this._TOP:   
                    pos = this.seat[2].position;
                    pos.y-=110;
                    break;
                case this._RIGHT: 
                    pos = this.seat[3].position;
                    pos.y-=110;
                break;
            }
           
            this._cards[this._cp++].emit('deal',{x:pos.x-22,y:pos.y,seat:s});
            this._cards[this._cp++].emit('deal',{x:pos.x+22,y:pos.y,seat:s});
            s++;
            if(s>4)s =1;
        }, 0.5, 3, 0);
    },
    //亮牌----------------------
    ShowCard:function(data,score){
        //data = [1,1,2,2,3,3,4,4];
        //
        var p = this._cp-8;
        var x= -15;
        //p += this._first*2-2;
        var s =this._first*2-2;
        for(let i = 0;i<8;i++){

            if(i%2 ==0 )
                x= -15;                
            else
                x= 15;
            this._cards[p++].emit('show',{img:this.imgs[data[s++]],x:x});    
           
            if(s>=8)s=0;
            
           // if(p == this._cp) p= this._cp-8;
        }

        this.ShowPoint(data);

        this.scheduleOnce(function() {    
            this.Result(data,score);
        }, 3);
    },


    ShowPoint:function(data){
       // var p = this._cp-8;  
        var c1=0;
        var c2=0;      
        var point =0;
        var seat =1;// this._first;
        for(let i = 0;i<8;i+=2){
            c1 = data[i];
            c2 = data[i+1]     

            if(c1 == c2)//对子
                point = 10+c1;
            else
                point = (c1+c2)%10;             

            //this.playerpoint[this._first].node.active = true;
            
            switch(seat){
                case this._SELF:
                     this.playerpoint[0].node.active = true;
                     this.playerpoint[0].spriteFrame = this.point[point];
                break;
                case this._LEFT:
                     this.playerpoint[1].node.active = true;
                     this.playerpoint[1].spriteFrame = this.point[point];
                break;
                case this._TOP:
                     this.playerpoint[2].node.active = true;
                     this.playerpoint[2].spriteFrame = this.point[point];
                break;
                case this._RIGHT:
                     this.playerpoint[3].node.active = true;
                     this.playerpoint[3].spriteFrame = this.point[point];
                break;
            }

            seat++;
            if(seat>4)seat =1;
        }
    },

    //结算----------------------
    Result:function(data,score){
        console.log('------游戏结算--------');
        
        //this.win_result.active = true;
        
        var playerscore = [];
        var c=0;
        for(let j=0;j<4;j++){
            for(let i in global.playerinfo){
                if( j+1 == this.SeatTran(global.playerinfo[i].seat)){
                    playerscore.push({
                        nick:global.playerinfo[i].nickname,
                        card:[data[c++],data[c++]],
                        gold:0,
                        score:score[j]
                    });
                    if( cc.isValid(global.playerinfo[i].score))
                        global.playerinfo[i].score+=score[j];
                    else
                        global.playerinfo[i]['score']= score[j];

                    if(j+1 == this._banker){
                        // this.btn_bar.emit('setbetnum',{num:this._bankerbet +=score[j] });
                        switch(j+1){
                            case this._SELF:this.selfseat.emit('setbetnum',{num:this._bankerbet +=score[j] });break;
                            case this._LEFT:this.seat[1].emit('setbetnum',{num:this._bankerbet +=score[j] });break;
                            case this._TOP:this.seat[2].emit('setbetnum',{num:this._bankerbet +=score[j] });break;
                            case this._RIGHT:this.seat[3].emit('setbetnum',{num:this._bankerbet +=score[j] });break;
                        }    
                    }

                    break;
                }
            }
        }
        cc.log(playerscore);
        this.UpdatePlayer(global.playerinfo);

        this.win_result.active = true;
        this.win_result.emit('setscore',{score:playerscore});      
    },
    //重置小回合--------------------圈
    NextGame:function(){
        this._round++;
        if(this._round!=4)
            if(this._selfseat == this._banker)
                this.btndice.active = true;
        else
            this._round=0;

        var p = this._cp-8;
        for(let i = 0;i<8;i++){
             this._cards[p++].destroy();
        }

        for(let i = 0;i<4;i++){
             this.playerpoint[i].node.active = false;
        }

        this._status =1;
        this.RecoveryChip();
    },
    //重置大回合-------------------轮
    RestGame:function(){

    },   
   
    //设置 计时器
    StartTimer:function(timelen,tip,callback){
        this.timeprog.node.active = true;
        this.timeprog.progress=0;

        this.timetip.string = tip;
        timelen =10;
        var game = this;
        this.timeprog.schedule( function() {                         
            game.timeprog.progress+=1/timelen*0.2;    
            if(game.timeprog.progress >= 1)
                if( callback != null) 
                    callback(game); 
                else    
                    game.StopTimer();          
        }, 0.2, timelen/0.2, 0);
    },
    StopTimer:function(){

        this.timeprog.unscheduleAllCallbacks();
        this.timeprog.node.active = false;
    },

    TimeOut_Dice:function(that){
        if(that._status ==0)
            global.socket.SendMsg(5013);
        else
            if(that._status ==1)
                global.socket.SendMsg(5015);
        that.btndice.active = false;       
        that.StopTimer();
    },
    TimeOut_Bet:function(that){
        that.btn_bar.emit('autobet');
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

    Btn_Dice:function(){
        
        if(this._status ==0)
            global.socket.SendMsg(5013);
        else
            if(this._status ==1)
                global.socket.SendMsg(5015);
        this.btndice.active = false;       
        this.StopTimer();
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
        this._banker=3;
        this.PlayerBet(1,100);
        this.PlayerBet(2,100);
        this.PlayerBet(3,100);
        this.PlayerBet(4,100);
    },

    SeatTran:function(seat){
       // cc.log(seat);
        if(seat >2){
            if(seat == 4) return 3;
            else return 4;
        }else return seat;
    },
/**
    for(let i=1;i<5;i++){        
        for(let j=1;j<13;j++){
        console.log(i+'---'+ j +'------------'+ ((i+j-1)%4));        
    }
    */
});
