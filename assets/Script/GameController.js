var global = require('Global'); 
var GameStep = cc.Enum({
    WAIT:0,
    SELECTBANKER:-1,
    BET:-1,
    SHOW:-1,
});

// const AS_READY  = 'AS_READY';
// const AS_PLAYER_DICE = 'AS_PLAYER_DICE';//玩家摇色子
// const AS_DELAY_PLAYER_DICE ='AS_DELAY_PLAYER_DICE';//延迟 显示玩家打色子结果
// const AS_WAIT_FOR_PLAYER_DICE ='AS_WAIT_FOR_PLAYER_DICE';//等待玩家摇色子
// //timeOut_PlayerDice

//  const AS_BANKER_BET = 'AS_BANKER_BET';
//  const AS_DELAY_BANKER_BET= 'AS_DELAY_BANKER_BET';//延迟 显示庄家下底结果
//  const AS_WAIT_FOR_BANKER_BET ='AS_WAIT_FOR_BANKER_BET';//等待庄家下底
//  //timeOut_Banker_Bet

//  const AS_BANKER_DICE ='AS_BANKER_DICE';
//  const AS_DELAY_BANKER_DICE ='AS_DELAY_BANKER_DICE';//延迟 显示庄家摇色结果
//  const AS_WAIT_FOR_BANKER_DICE ='AS_WAIT_FOR_BANKER_DICE';//等待庄家打色子选第一个起牌的人
//  //timeOut_Banker_Dice

// const AS_PLAYER_BET ='AS_PLAYER_BET';
// const AS_DELAY_PLAYER_BET ='AS_DELAY_PLAYER_BET';//
// const AS_WAIT_FOR_PLAYER_BET='AS_WAIT_FOR_PLAYER_BET';//等待非庄玩家下注
// //timeOut_PlayerBet_Finish

// const AS_DELAY_DEALCARD = 'AS_DELAY_DEALCARD';//发牌

// const AS_COMPARE_CARD ='AS_COMPARE_CARD';//比牌
// const AS_DELAY_COMPARE_CARD='AS_DELAY_COMPARE_CARD';//延迟比牌结果
// const AS_DELAY_COMPARE_CARD2 = 'AS_DELAY_COMPARE_CARD2';


// const AS_BANKER_CONTINUE_BET='AS_BANKER_CONTINUE_BET';//庄家续庄
// const AS_WAIT_FOR_BANKER_CONTINUE_BET = 'AS_WAIT_FOR_BANKER_CONTINUE_BET';//等待庄家续庄
// //timeOut_Banker_Continue_Bet
// const AS_DELAY_BANKER_CONTINUE_BET = 'AS_DELAY_BANKER_CONTINUE_BET';


// const AS_RESULT ='AS_RESULT';//结算结果
// const AS_WAIT_FOR_NEXT_ROUND= 'AS_WAIT_FOR_NEXT_ROUND';//等待下回合开始
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

        indicator:cc.Node,
        timeprog:cc.ProgressBar,
        timetip:cc.Label,

        btndice:cc.Node,
        dice:[cc.Node],

        roomid:cc.Label,
        table:cc.Node,//桌面层
        cardlayer:cc.Node,
        chiplayer:cc.Node,//筹码层

        win_result:cc.Node,
        win_playerlist:cc.Node,
        win_bankercheck:cc.Node,
        win_fisherbet:cc.Node,

        win_set:cc.Node,

        btn_bar:cc.Node,
        btn_ready:cc.Node,
        btn_switchseat:cc.Node,//换位按钮
        banker:cc.Node,



        finalresult:cc.Node,

        chat:cc.Node,


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

        _status:'',
        _round:0,

        //本轮玩家的牌
        _playercards:[],
      
        _bankerbetchance:3,//庄家下注机会

        _bankerbet:0,//锅底数

        _isfisher:false,//是否钓鱼人

        _isrushcard:false,

       //是否有白板
       isHaveBan:true,


       _final_result:null,
       
       //_canvas:cc.Canvas,       
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        // this._canvas = cc.Canvas.instance;

       // this.roomid.string = '房间密码:'+ global.roominfo.group_id;
        if(cc.isValid(global.roominfo) && cc.isValid(global.playerinfo)){
            this.roomid.string = '房间密码:'+  global.roominfo.id;
        
            //确定方位       
            for(let i in global.playerinfo){
                if(global.playerinfo[i].id == global.selfinfo.id){
                    this._selfseat= global.playerinfo[i].seat; //                    
                    break;            
            } }    
            if( this._selfseat ==null || this._selfseat ==0 ) this._isfisher = true;   
        }else
            this._SELF = this._selfseat = 3;

        //-------------------------------------
        if(this._isfisher) this._selfseat =1;
        this._SELF = this._selfseat;
        this._LEFT = ( (this._selfseat+1)%4==0)?4:(this._selfseat+1)%4;
        this._TOP =  ( (this._selfseat+2)%4==0)?4:(this._selfseat+2)%4;
        this._RIGHT =( (this._selfseat+3)%4==0)?4:(this._selfseat+3)%4;       

        this.indicator.emit('initseat',{seat:this._selfseat});

        if(cc.isValid(global.playerinfo))
            this.UpdatePlayer(global.playerinfo);

        cc.Canvas.instance.node.on('touchstart', this.Touch,this);
        // this.node.on('nextgame',function(){
        //         switch(this._status){
        //             case 'AS_WAIT_FOR_NEXT_ROUND':
                        
        //                 this.NextGame();
        //             break;
        //             case 'AS_WAIT_FOR_NEXT_ROUND2':
                   
        //                 this.RestGame();
        //                 this.RecoveryChip(true);
        //             break;                   
        //         }
        // },this);

        this.node.on('bankercontinue',function(){
            if(this._status =='AS_WAIT_FOR_BANKER_CONTINUE_BET'){
                this.StartTimer(10,'请选择您要设的锅底数',this._banker,null); 
                this.btn_bar.emit('showbankerbtn',{method:5013}); 
                return;    
            }
            if(this._status =='AS_WAIT_FOR_BANKER_CONTINUE'){
                //发送续庄
                //this.RestGame();  
                //this.CreatCard();
                global.socket.SendMsg(5011,true);
            }
        },this);
        this.node.on('bankerexit',function(){
            if(this._status =='AS_WAIT_FOR_BANKER_CONTINUE_BET'){
                global.socket.SendMsg(5013,0);
                return;    
            }
            if(this._status =='AS_WAIT_FOR_BANKER_CONTINUE'){
                //发送下庄
               // this.RestGame();
                //this.RecoveryChip(true);
               // this.CreatCard();
                global.socket.SendMsg(5011,false);
            }
        },this);

        //cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START,this.Touch,this)

        this.InitNodePool();       

        this.btn_ready.active = !this._isfisher;
        
        //this.btn_switchseat.active = true;

        global.socket.controller = this;
        

        // this._final_result = [ {id:'1',nick:'xxx',score:100,gold:10,seat:1},
        // {id:'2',nick:'xxx',score:100,gold:10,seat:2},
        // {id:'3',nick:'xxx',score:100,gold:10,seat:3},
        // {id:'4',nick:'xxx',score:100,gold:10,seat:4}
        //  ];
        // global.PopWinTip(2,'该房间游戏已结束',this.ShowFinalResult ); 
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
       // cc.log(data);
        if(data[4]!=null) {
            //错误处理
            switch(data[4]){
                case 'MUST_BE_QUIT':
                    global.socket.SendMsg(3005);                    
                break;
            }
            return;
        }
        var type = data[0];
        var msg =  data[1];
        //cc.log(msg);
        switch(type){            
            //case 3002:    //创建一个房间
            case 3008:     //加入一个房间         
                if(global.roominfo==null)
                    global.GetRoomInfo(msg[0]);

                this.AddPlayer(msg[1]);
                this.UpdatePlayer(global.playerinfo);
            break;
            
            case 1004:   //某人强退
            case 3006:      //有人退出               
                this.DelPlayer(msg);
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

            case 3010://重新上线
            break;

            case 2004://聊天信息    
                //查找id对应的玩家
                for(let j in global.playerinfo)
                if(msg[0] == global.playerinfo[j].id) {

                  // cc.log( this.SeatTran( global.playerinfo[j].seat ) );

                       this.chat.emit('chat',{ msg:msg[1],
                                               nick: global.playerinfo[j].nick,
                                               seat: this.SeatTran( global.playerinfo[j].seat)+1  });
                    break;}
            break;

            case 5002://游戏逻辑处理
           
                this._status = msg[0];
                switch(this._status){
                    case 'AS_WAIT_FOR_PLAYER_DICE':
                        this.WaitForSelectBanker( msg[1],msg[2] ); 
                    break;

                    case  'AS_DELAY_PLAYER_DICE':
                        var seat = msg[2];                
                        var dice = msg[3];  
                        var len = msg[1];              
                    
                        this.StopTimer();
                        this.btndice.active = false;
                        this.SetDice(seat,dice[0],dice[1]);
        
                        this.scheduleOnce(function() {
                            this.dice[0].emit('rest');
                            this.dice[1].emit('rest');
                        }, len);              
                    break;

                    case 'AS_WAIT_FOR_BANKER_BET':
                        this.StopTimer();
                        //定庄，等待庄下底  
                        var len = msg[1];
                        var seat = msg[2]; 
                        
                        this._bankerbetchance = 3;
                        this.btn_bar.emit('rest');
                        this.RecoveryChip(true);

                        if(!this._isrushcard)
                            this.CreatCard();                        

                        this.SetBanker(seat);   
                        this.scheduleOnce( function(){
                            this.WaitForBankerBet(len);
                        },5);
                    break;

                    case 'AS_DELAY_BANKER_CONTINUE_BET':
                    case 'AS_DELAY_BANKER_BET':
                        //庄下底动画结束
                        var len = msg[1]-0;
                        var seat = msg[2]-0;
                        var bet = msg[3]-0;
                        this._bankerbet = bet-0;                        
                        this.StopTimer();

                        if(bet >0)
                            this.PlayerBet(seat,bet, global.GetPlayerBySeat(this._banker).id);

                        if(seat == this._selfseat)
                            this.btn_bar.emit('hidebankerbtn',{bet:bet});
                    break;

                    case 'AS_WAIT_FOR_BANKER_CONTINUE_DICE':
                        //下一局游戏
                       
                    //不中断按正常摇色子开始                   
                    case 'AS_WAIT_FOR_BANKER_DICE':
                        //等待庄家摇色子选第一个起牌位
                        var len = msg[1];
                        var seat = msg[2];
                        this.WaitForBankerDice(len);
                    break;

                    case 'AS_DELAY_BANKER_DICE':
                        //庄家摇色子延迟
                        var len = msg[1];
                        var seat = msg[2];
                        var dice = msg[3];
                        
                        this.btndice.active = false;
                        this.StopTimer();
                        this.SetDice(seat,dice[0],dice[1]);

                        this.scheduleOnce(function() {
                            this.dice[0].emit('rest');
                            this.dice[1].emit('rest');
                        }, len);
                    break;

                    case 'AS_WAIT_FOR_PLAYER_BET':
                        //闲家下注
                        var len = msg[1]-0;
                        if(msg.length>3){
                          //  var id =msg[2];
                         //  var seat = msg[3];
                          //  var bet = msg[4];

                            var player=  global.GetPlayerByID(msg[2]);
                            player.bet = msg[4];
                           
                            for(let i in player.bet){
                                if(player.bet[i]>0)                                   
                                    this.PlayerBet(i-0,player.bet[i]-0 ,msg[2]);//下注人id（用来区分是否钓鱼人）
                            }
                        }
                        else{
                            //等待闲家下注
                            this.WaitForPlayerBet(len);
                        }                        
                    break;

                    case 'AS_DELAY_PLAYER_BET':
                        //闲家下注结束，未下注的自动下注(钓鱼者不下注)
                        var len = msg[1];
                        var playersbet = msg[2];//[ id, [0,0,0,0,0]  ]

                        this.StopTimer();
                        this.btn_bar.emit('hidebtn');                        

                        for(let i in playersbet){  
                            if(!cc.isValid( playersbet[i][1]) ) continue;    
                            
                            for(let s=1;s<5;s++){
                                var bet = playersbet[i][1][s];
                                if(bet > 0){    
                                    var player =  global.GetPlayerByID(playersbet[i][0]);                  
                                    if( player.bet[ s ] == 0 ) {  
                                        player.bet[s] = bet;                                        
                                        this.PlayerBet(s,bet, playersbet[i][0] );             
                                    }                       
                                    break;
                                }
                            }
                        }
                    break;

                    case 'AS_DELAY_DEALCARD':
                        //发牌
                        var len = msg[1];
                        this._first = msg[2];
                        this.StopTimer();
                        this.Deal(msg[3]);  
                    break;

                  
                    case 'AS_DELAY_COMPARE_CARD':
                    case 'AS_DELAY_COMPARE_CARD2':
                    case 'AS_DELAY_COMPARE_CARD3':
                        //比牌
                        // 0   self.banker_bet,
                        // 1   score,
                        // 2   banker.opts.seat,
                        // 3   player.opts.seat,
                        // 4   betseat
                        // 5    id
                        this.WaitForCompareCard(msg[1],msg[2][4]);
                        this.CompareCard(msg[2]);
                    break;               

                    case 'AS_WAIT_FOR_NEXT_ROUND2'://庄破产下庄 结算                        
                    case 'AS_WAIT_FOR_NEXT_ROUND'://正常结算
                        var len = msg[1];
                        this.StopTimer();
                        this.Result(msg[2],len-5,false);  
                        global.roominfo.curr_fund = msg[3];                        
                    break;     

                    case 'AS_GAMEOVER':
                        this.SaveGame(msg[2]);
                        global.PopWinTip(2,'该房间游戏已结束',this.ShowFinalResult ); 
                    break;

                    case 'AS_WAIT_FOR_BANKER_CONTINUE'://询问是否续庄
                        //重置游戏
                        var len = msg[1];                        
                        this.WaitForBankerContinue(len-5);
                    break;   

                    case 'AS_WAIT_FOR_BANKER_CONTINUE_BET':
                        var len  =msg[1];
                        this.WaitForBankerContinueBet(len-5);
                    break;       
                    
                    case 'AS_DELAY_NEXT_ROUND':
                        var len  = msg[1];
                        var round = msg[2];
                        var hand = msg[3];
                        var next_status = msg[4];
                        switch(next_status){
                            case 'AS_WAIT_FOR_PLAYER_BET'://等待继续打色子
                                this.NextGame();
                            break;
                            case 'AS_WAIT_FOR_BANKER_CONTINUE'://等待续庄
                                this.RestGame();          
                                this.CreatCard();                      
                            break;
                            case 'AS_WAIT_FOR_BANKER_BET'://下家做庄，等待下锅底
                                this.RestGame();
                                this.RecoveryChip(true);
                            break;
                        }
                    break;
                }
            break;

            //切换座位
            case 5018:

            break;

            /*
            case 5016://庄选先起牌位
                //0 id   1 seat   2  first   3  pos
                //this._first = this.SeatTran( data[3].round_no_first_user_seat);
                this._first = data[3][2];
                this.StopTimer();
                this.SetDice(data[3][1],data[3][3][0],data[3][3][1]);

                this.scheduleOnce( function(){
                    this.dice[0].emit('rest');
                    this.dice[1].emit('rest');
                    this.WaitForPlayerBet();},3);                
            break;

             if(data[3][1] == this._banker){
                            this._status=1;
                            var bet = data[3][3]+0;
                            this._bankerbet = bet;
                            this.StopTimer();
                            this.PlayerBet(this._banker,bet);
                        
                            this.scheduleOnce( this.WaitForBankerDice,1);   
                        }

            

           

            case 5022:
                this.StopTimer();
                this.Deal(data[3][1]);  
            break;
            
            case 5024://亮牌结算(庄与闲 两人结算)
              //0 roomid   1 bankerid  2 bankerseat   3 playerid  4 player seat  5 6 7  
              //8 bankergold  9 banker score 10  11 player score   12  13 player gold            
                cc.delayTime(1);
                this.CompareCard(data[3]);
            break;

            case 5026://显示总结算表
                this.Result(data[3]);
            break;

            case 5028://问询是否续庄
                // if(this._banker ==  this._selfseat){
                //     this.win_bankercheck.active  = true;
                // }
                this.WaitForBankerContinue();
            break;

            case 5030://开始下一把
                if(this._round==4){
                    this.RestGame();
                 
                }else{
                    this._round = data[3][1];
                    if(this._selfseat == this._banker)
                        this.btndice.active = true;
                }
            break;

            case 5072://续锅筹码
                //5028  5034  5038
                this.StopTimer();
                switch(data[3][0]){
                    case 0://续庄
                        this._bankerbet = data[3][4];
                        //this.StopTimer();
                        this.PlayerBet(this._banker,this._bankerbet);
                    break;
                    case 5024:
                        this.CompareCard(data[3][1]);
                    break;
                    case 5028://询问续庄
                        this.WaitForBankerContinue();
                    break;
                    case 5034://                   
                    case 5038://
                        cc.log(data[3][1]);
                       
                    break;
                }
                //玩家续庄消息
                if(data[3][2]){
                    if(data[3][2][1] == this._selfseat){
                        
                        this._bankerbet += data[3][2][2];
                        this.StopTimer();
                        this.PlayerBet(this._banker,data[3][2][2]);                        
                    }    
                }
                //
            break;
        
            default:           
            break;         
            */ 
        }        
    },

    //玩家下注
    PlayerBet:function(seat,num,playerid ){       

       // cc.log('---PLAYER BET----'+ seat +'    '+ num);
        //seat =1;
        var p0=null;
        var p1=null;      
        
        var funcname = 'updatebetnum';

        if(seat == this._banker){
            funcname = 'bankerbet';
            if(num ==200)
                this._bankerbetchance=2;
            if(num == 300)
                this._bankerbetchance=1;
            if(num == 500)
                this._bankerbetchance=0;
        }


        var playerseat = global.GetPlayerByID(playerid).seat;
        var isfish = true;

        if(playerseat>0) isfish = false;

        switch(seat){
            case this._LEFT:
                p0 = this.seat[1].position;
                p1 = cc.v2(p0.x+200,p0.y-100);    
                this.seat[1].emit(funcname,{num:num,seat:playerseat});               
            break;
            case this._TOP:
                p0 = this.seat[2].position;
                p1 = cc.v2(p0.x+200,p0.y-100); 
                this.seat[2].emit(funcname,{num:num,seat:playerseat});    
            break;
            case this._RIGHT:
                p0 = this.seat[3].position;
                p1 = cc.v2(p0.x-200,p0.y-100); 
                this.seat[3].emit(funcname,{num:num,seat:playerseat});    
            break;
            case this._SELF:
                p0 = this.selfseat.position;
                p1 = cc.v2(p0.x+100,p0.y+250); 
                this.selfseat.emit(funcname,{num:num,seat:playerseat});    
            break;
        }
        if(p0 == null) return;        

               
        var chip;
        if(this._chippool.size()>0)
			chip = this._chippool.get();
		else
            chip =cc.instantiate(this.chip);  

        if(isfish){
            //钓鱼
            chip.getComponent(cc.Sprite).spriteFrame = this.chipimg[4];
        }else{
            if(seat != this._banker)
                chip.getComponent(cc.Sprite).spriteFrame = this.chipimg[3];
            else{
                if(num == 200 )  chip.getComponent(cc.Sprite).spriteFrame = this.chipimg[0];
                if(num == 300 )  chip.getComponent(cc.Sprite).spriteFrame = this.chipimg[1];
                if(num == 500 )  chip.getComponent(cc.Sprite).spriteFrame = this.chipimg[2];
            }
        }
        
        chip.parent = this.chiplayer;
        chip.setPosition(p0);  

        chip.name = playerid;
        chip.seat = seat;

        if(isfish)
            chip.runAction(cc.moveTo(0.4,p1.x+25,p1.y-25));   
        else
            chip.runAction(cc.moveTo(0.4,p1));
        
        this.PlaySound('bet');
    },

    //资金结算，转移筹码
    Settlement:function(winner ,loser,seat){
        var winner_chips=null;
        var loser_chips=null;
        var chips = this.chiplayer.children;
        
        //this.GetPlayerSeat(winner).emit('');
        //this.GetPlayerSeat(loset).emit('');

        var win_player = global.GetPlayerByID(winner);
        var lose_player = global.GetPlayerByID(loser);

        // for(let i in chips){
        //     if(chips[i].name == loser && chips[i].tag == seat)                
        //         loser_chips = chips[i];
           
        //     if(chips[i].name == winner && chips[i].tag == seat)
        //         winner_chips = chips[i];                            
        // }

        // if(winner_chips==null || loser_chips ==null ) {
        //     cc.log('未找到对应的筹码');
        //     return;}

        if(this._banker == win_player.seat){  //庄赢
          
            for(let i in chips){               

                if(chips[i].name == loser && chips[i].seat == seat)                
                    loser_chips = chips[i];
               
                if(chips[i].name == winner)
                    winner_chips = chips[i]; 
            }
          
            winner_chips.setSiblingIndex(loser_chips.getSiblingIndex()+1); 
            loser_chips.runAction(cc.moveTo(0.4,winner_chips.position ));

        }else{//闲赢
            if(this._banker == lose_player.seat){

                for(let i in chips){                  

                    if(chips[i].name == loser)                
                        loser_chips = chips[i];
                   
                    if(chips[i].name == winner && chips[i].seat == seat)  
                        winner_chips = chips[i];                            
                }

                var chip;
                if(this._chippool.size()>0)
                    chip = this._chippool.get();
                else
                    chip =cc.instantiate(this.chip);  
                
                chip.parent = this.chiplayer;
                chip.setPosition(loser_chips.position);  
                chip.getComponent(cc.Sprite).spriteFrame = loser_chips.getComponent(cc.Sprite).spriteFrame;     
                chip.name = winner_chips.name;
                chip.seat = seat;
                chip.setSiblingIndex(winner_chips.getSiblingIndex()-1);
                chip.runAction(cc.moveTo(0.4,winner_chips.position)); 
            }
        }

        this.PlaySound('bet');
    },
    //回收筹码
    RecoveryChip:function( clearbanker ){
        var chips = this.chiplayer.children;          

        var l = chips.length;
        var j=0;
        for(let i=0;i<l;i++){
            if(!clearbanker && chips[j].name != global.GetPlayerBySeat(this._banker).id)   
                this._chippool.put(chips[j]); 
            else 
                j++;  
        }
      

        for(let i=1;i<=4;i++){
            if(!clearbanker && i== this._banker) continue;
            this.GetPlayerSeat(i).emit('clearbet');
        }

        if(clearbanker)
            this.chiplayer.removeAllChildren(); 
    },
    
    // update: function (dt) {

    // },

    //添加 玩家------------------
    AddPlayer:function(data){
       
        for(let i in data){
            var ishave = false;
            var player = global.GetPlayerInfo(data[i]);
            for(let j in global.playerinfo)
                if(player.id == global.playerinfo[j].id) {
                    ishave = true;
                    break;}

            if(!ishave) {
                // //设置 头像地址               
                // if(player.headurl !== null)
                //     player.headurl = "http://"+global.socket.URL+"/client/user/avatar?id="+player.id;
                global.playerinfo.push(  player  );
            }            
        }              
    },
    //删除玩家
    DelPlayer:function(id){

        for(let j in global.playerinfo)
            if(id == global.playerinfo[j].id) {
                if(this._status == '')                
                    global.playerinfo.splice(j,1);
                else
                    global.playerinfo[j].online = false;
                break;}
    },

    UpdatePlayer:function(data){
        for(let j=1;j<4;j++)
            this.seat[j].emit('clear'); 

        for(let i in data)    {                   
            if( data[i].seat==null  ) continue;
            if( data[i].seat>0){
               // if(cc.isValid(data[i].headurl))
               //cc.log(data[i].headimg);
                    this.GetPlayerSeat( data[i].seat).emit('setplayerinfo',{nick:data[i].nick,score:data[i].score,seat:data[i].seat,head:data[i].headimg,online:data[i].online}); 
                //else
                //    this.GetPlayerSeat( data[i].seat).emit('setplayerinfo',{nick:data[i].nick,score:data[i].score,head:null}); 
            }    
        }      

        this.win_playerlist.emit('updateplayer',{data:data});
    },

    //===============================================================//
    //-------------------------游戏步骤-------------------------------//
    //===============================================================//

    WaitForSelectBanker:function(len,seat){

        if(this._selfseat == seat && !this._isfisher){
            this.btndice.active = true;
            this.StartTimer(len,'请掷骰子选庄',seat,null);
        }else
            this.StartTimer(len,'等待玩家掷骰子选庄',seat,null);            
    },
    WaitForBankerBet:function(len){
        if(this._selfseat == this._banker && !this._isfisher ){  
            this.btn_bar.emit('showbankerbtn',{method:5005});        
            this.StartTimer(len,'请选择您要设的锅底数',this._banker,null); 
        }else
            this.StartTimer(len,'等待庄家下锅底',this._banker,null);  
    },

    WaitForBankerDice:function(len){
        if(this._selfseat == this._banker && !this._isfisher){
            this.btndice.active = true;   
            this.StartTimer(len,'请掷骰子决定首先揭牌的玩家座位',this._banker,null); 
        }else
            this.StartTimer(len,'等待庄家掷骰子决定首先揭牌的玩家座位',this._banker,null);  
    },

    WaitForBankerContinueBet:function(len){
        //cc.delayTime(2);
        if(this._selfseat == this._banker && !this._isfisher){  
            //this.btn_bar.emit('showbankerbtn');        
            //this.StartTimer(10,'请选择您要设的锅底数',this.TimeOut_Bet); 
            if(this._bankerbetchance >0 )
                this.win_bankercheck.active = true;
            else
                require('Global').socket.SendMsg(5013,0);
        }else
            this.StartTimer(len,'等待庄家续庄',this._banker,null);  
    },

    WaitForBankerContinue:function(len){
        //cc.delayTime(2);
        if(this._selfseat == this._banker && !this._isfisher){  
                        
            this.win_bankercheck.active = true;
           
        }else{
            var that = this;
            this.StartTimer(len,'等待庄家续庄',this._banker,null);  
        }
    },
   
    WaitForPlayerBet:function(len){

        var minbet = 20;
        switch(this._bankerbetchance){
            case 0: minbet = 50;
            break;
            case 1:minbet =30;
            break;
            case 2: minbet =20;
            break;
        }

        if(this._isfisher){
            this.StartTimer(len,'请下注',0,null);
            this.win_fisherbet.active = true;
            this.win_fisherbet.emit('setfisherbet',{bankerbet:this._bankerbet,minbet:minbet,bankerseat:this._banker,len:len});
        }else{
            if(this._selfseat == this._banker )          
                this.StartTimer(len,'等待闲家下注',0,null); 
            else{                
                this.btn_bar.emit('showbtn',{maxbet:this._bankerbet,minbet:minbet,seat:this._selfseat,method:5009});                
                this.StartTimer(len,'请下注',0,null);
            }
        }        
    },

    WaitForCompareCard:function(len,seat){
        //等待比牌
        this.StartTimer(len,'',seat,null);
    },

    //码牌-------------------
    CreatCard:function(){
        this._isrushcard = true;
        var x = -450;
        var y = -cc.Canvas.instance.node.height/2 +200;
        var num =40;
        if(!this.isHaveBan) num =36;

        x = -( 44*num/2  ) /2 +22;

        this._cp=0;
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
            this._cards[i].parent = this.cardlayer;           
            this._cards[i].x =x;
            this._cards[i++].y =y;    
           

            this._cards[i] = cc.instantiate(this.pcard);
            this._cards[i].parent = this.cardlayer;
            y+=16;
            this._cards[i].x =x;
            this._cards[i++].y =y;       

            x+=44;
            y-=16;     

            this.PlaySound('createcard');
            
            //if(i>=36  )                   
            //    this.WaitForBankerBet();                 
            
        }, 0.1, num/2-1, 0);
    },

    //打骰子--------------------
    SetDice:function(seat,d1,d2){        
      
        this.dice[0].active = this.dice[1].active = true;
        var x=0;
        var y=0;
       
        switch(seat){
            case this._SELF:
                x = this.selfseat.x;
                y = this.selfseat.y;
            break;
            case this._LEFT:
                x = this.seat[1].x;
                y = this.seat[1].y;
            break;
            case this._TOP:
                x = this.seat[2].x;
                y = this.seat[2].y;
            break;
            case this._RIGHT:
                x = this.seat[3].x;
                y = this.seat[3].y;
            break;
        }
      
        this.dice[0].emit('roll',{pos:d1,x:x,y:y,id:1});
        this.dice[1].emit('roll',{pos:d2,x:x,y:y,id:2});      

        this.PlaySound('dice');
    },
    //设庄---------------------
    SetBanker:function(seat){
        this._banker= seat;

        this.banker.active = true;
        var pos;
        switch(this._banker){
            case this._SELF: pos = cc.v2(this.selfseat.x-85,this.selfseat.y+90); ;break;
            case this._LEFT: pos = cc.v2(this.seat[1].x-75,this.seat[1].y+80);break;
            case this._TOP:  pos = cc.v2(this.seat[2].x-155,this.seat[2].y);break;
            case this._RIGHT:pos = cc.v2(this.seat[3].x+75,this.seat[3].y+80);break;
        }  

       // var actfinished = cc.callFunc( this.CreatCard,this  );
        this.banker.setPosition(0,55);
        this.banker.runAction(cc.sequence(  cc.scaleTo(0.2,3),
                                            cc.delayTime(0.5),
                                            cc.spawn(   cc.moveTo(0.4,pos.x,pos.y),
                                                        cc.scaleTo(0.4,1) )
                                            //actfinished
        ));
        //this.banker.setPosition(pos.x,pos.y);
    },   

    //发牌------------------------
    Deal:function(cards){
        this._isrushcard = false;
        //first =1;
        var s= this._first;
        //s=1;
        //this._first = first;       
       this._playercards = cards;
       this.GetPoint(cards);

       
        this.schedule( function() {     
            var pos=null;
            var spf1 = null;
            var spf2 = null;
            switch(s){
                case this._SELF:  
                    pos = this.seat[0].position; 
                    if(!this._isfisher){
                        spf1 = this.imgs[ cards[(this._SELF-1)*2]  ];
                        spf2 = this.imgs[ cards[(this._SELF-1)*2+1]  ];
                    }
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
            //cc.log(this._cards[this._cp].seat);
            this._cards[this._cp].seat=s;
            this._cards[this._cp++].emit('deal',{x:pos.x-22,y:pos.y,offx:-15,spf:spf1});
            this._cards[this._cp].seat=s;
            this._cards[this._cp++].emit('deal',{x:pos.x+22,y:pos.y,offx:15,spf:spf2});
            s++;
            if(s>4)s =1;

            this.PlaySound('dealcard');
        }, 0.5, 3, 0);
    },

    //比牌
    CompareCard:function( data ){
         //0 roomid   1 bankerid  2 bankerseat   3 playerid  4 player seat  5 6 7  
              //8 bankergold  9 banker score 10  11 player score   12  13 player gold

              //0   self.banker_bet,
              // 1   score,
              // 2   banker.opts.seat,
              // 3   player.opts.seat,
              // 4   betseat
              // 5    id

        this._bankerbet = data[0]-0;        
        var score = data[1]-0;
        var bankerseat = data[2]-0;
        var playerseat = data[3]-0;
        var betseat =data[4]-0;
        var id  = data[5];

        //取得跟庄比的玩家信息
        var player = global.GetPlayerByID(id);
        var banker = global.GetPlayerBySeat( this._banker);
      
        player.bet[betseat] -= score;
        
        banker.score += score;
        player.score -= score;

        //取得此次跟庄比的座位号
        var compareseat = data[4];       
       
        //亮对手的牌----------------------------
        //-------------------------------------
        var showcardseat =compareseat;
        if(compareseat == this._selfseat)
            showcardseat =  this._banker;        
        

        var p = (showcardseat-1)*2;
        var x =-15;
        for(let i= this._cp-8;i<this._cp;i++){
            if(this._cards[i].seat == showcardseat){
                
                this._cards[i].emit('show',{img:this.imgs[  this._playercards[p++] ],x:x});
                x+=30;  
            }
        }

        //显示牌的点数
        if( this._banker == this._selfseat || compareseat == this._selfseat){
            
            if(this._isfisher){//钓鱼者亮自己所在位的牌(默认1号位)
                for(let i= this._cp-8;i<this._cp;i++){
                    if(this._cards[i].seat == this._selfseat){
                        this._cards[ i  ].emit('show',{img:this.imgs[  this._playercards[0 ] ],x:-15});
                        this._cards[ i+1  ].emit('show',{img:this.imgs[  this._playercards[1 ] ],x: 15});
                        break;
                    }
                }
            }

            this.playerpoint[ this.SeatTran(this._selfseat)  ].node.active = true;  
        }

        this.playerpoint[ this.SeatTran(showcardseat)  ].node.active = true;    

        
        if(data[1]==0) return;//没有下注分数 返回


        //划拔筹码--------------------------------
        //----------------------------------------      


        this.GetPlayerSeat( this._banker).emit('bankerbet',{num:this._bankerbet });       

        if(score>0){//庄赢
            this.Settlement(banker.id ,id,betseat);//win loser num
            this.GetPlayerSeat( compareseat ).emit('updatebetnum');
        }else{//闲赢
            this.Settlement(id ,banker.id,betseat);
            this.GetPlayerSeat( compareseat ).emit('updatebetnum');
        }  
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

        //this.ShowPoint(data);

        this.scheduleOnce(function() {    
            this.Result(data,score);
        }, 3);
    },


    GetPoint:function(data){
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
                     //this.playerpoint[0].node.active = true;
                     this.playerpoint[0].spriteFrame = this.point[point];
                break;
                case this._LEFT:
                     //this.playerpoint[1].node.active = true;
                     this.playerpoint[1].spriteFrame = this.point[point];
                break;
                case this._TOP:
                     //this.playerpoint[2].node.active = true;
                     this.playerpoint[2].spriteFrame = this.point[point];
                break;
                case this._RIGHT:
                     //this.playerpoint[3].node.active = true;
                     this.playerpoint[3].spriteFrame = this.point[point];
                break;
            }

            seat++;
            if(seat>4)seat =1;
        }
    },   

    //结算----------------------
    Result:function(data,len,isfinish){
       // cc.log('------游戏结算--------');
       
        for( let i in data){
            if(data[i].seat >0 && data[i].seat<5){
                var s= data[i].seat;
                data[i].card = [this._playercards[  (s-1)*2 ],this._playercards[ (s-1)*2+1  ]];
                if(s ==  this._banker)
                    this.GetPlayerSeat(s).emit('bankerbet',{num:this._bankerbet ,seat:this._banker});
                //else
                //   this.GetPlayerSeat(s).emit('setbetnum',{num:data[i].score_count });
            }
            
            for(let j in global.playerinfo){
                if(data[i].id == global.playerinfo[j].id){
                    //cc.log(global.playerinfo[j]);
                    if(isfinish){                        
                        global.playerinfo[j].score = data[i].score_count;                        
                    }else{
                        var score = global.playerinfo[j].score_count;
                        global.playerinfo[j].score = data[i].score_count;
                        data[i].score_count -= score;   
                        global.playerinfo[j].score_count = global.playerinfo[j].score;
                    }
                    break;                 
                }
            }
        }
        
        // var playerscore = [];       
        // var bankerbet =0;
        // for(let j in data){
        //     for(let i in global.playerinfo){
        //         if( data[j][4] == global.playerinfo[i].seat){
        //             playerscore.push({
        //                 nick:global.playerinfo[i].nick,
        //                 card:[this._playercards[  (data[j][4]-1)*2 ],this._playercards[ (data[j][4]-1)*2+1  ]],
        //                 gold:data[j][13],
        //                 score:data[j][11]
        //             }); 
        //             bankerbet += data[j][9]; 
        //             break;
        //         }
        //     }
        // }        
        // //加庄信息
        // for(let i in global.playerinfo){
        //     if( data[0][2] == global.playerinfo[i].seat){
        //         playerscore.push({
        //             nick:global.playerinfo[i].nick,
        //             card:[this._playercards[(data[0][2]-1)*2 ],this._playercards[ (data[0][2]-1)*2+1  ]],
        //             gold:data[0][13],
        //             score:bankerbet
        //         });                
        //         break;
        //     }
        // }

        this.UpdatePlayer(global.playerinfo);

        this.win_result.active = true;
        this.win_result.emit('setscore',{score:data,len:len});      
    },
    //重置小回合--------------------圈
    NextGame:function(){
        // this._round++;
        // if(this._round!=4)
        //     if(this._selfseat == this._banker)
        //         this.btndice.active = true;
        // else
        //     this._round=0;
     
        var p = this._cp-8;
        for(let i = 0;i<8;i++){       
           // cc.log('check card  '+ p);
           if(cc.isValid(this._cards[p])){
               this._cards[p].active =false;
               this._cards[p].destroy();              
               this._cards[p]=null;
           }
           p++;
        }

        for(let i = 0;i<4;i++){
             this.playerpoint[i].node.active = false;
        }

        for(let i in global.playerinfo){
            global.playerinfo[i].bet = [0,0,0,0,0];
        }

        this._playercards.length=0;
        
        this.RecoveryChip(false);
    },
    //重置大回合-------------------轮
    RestGame:function(){
        this.NextGame();
        //清剩下的牌
        for(let i in this._cards){
            if(cc.isValid( this._cards[i] )){
                this._cards[i].destroy();
                this._cards[i] = null;
            }
        }       
        
        //this.btn_bar.emit('rest');
    },   
   
    //设置 计时器
    StartTimer:function(timelen,tip,seat,callback){
       // this.timeprog.node.active = true;
       // this.timeprog.progress=0;

        this.indicator.emit('setindicator',{tip:tip,num:timelen,seat:seat});

        this.timetip.string = tip;
        //timelen =10;
        // var game = this;
        // this.timeprog.schedule( function() {                         
        //     game.timeprog.progress+= 1/timelen*0.2;    
        //     if(game.timeprog.progress >= 1)
        //         if( callback != null) 
        //             callback(game); 
        //         else    
        //             game.StopTimer();          
        // }, 0.2, timelen/0.2, 0);
    },
    StopTimer:function(){
        this.indicator.emit('stopindicator');
        //this.timeprog.unscheduleAllCallbacks();
        //this.timeprog.node.active = false;
    },

    TimeOut_Dice:function(that){
        // if(that._status ==0)
        //     global.socket.SendMsg(5013);
        // else
        //     if(that._status ==1)
        //         global.socket.SendMsg(5015);
        // that.btndice.active = false;       
        // that.StopTimer();
    },
    TimeOut_Bet:function(that){
        //that.btn_bar.emit('autobet');
    },

    Touch:function(event){
        //cc.log(event)
        if(!this._poplist) return;
        if(event.target.name == this.win_playerlist.name) return;

        this._poplist = false;
         this.win_playerlist.emit('popin');         
    },


    ShowFinalResult:function( ){
       var game = global.socket.controller;
       //cc.log(game);
        game.finalresult.active = true;
        game.finalresult.emit('setresult',{data:game._final_result});
    },

    //按钮事件------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------

    //微信分享
    Btn_Share:function(){
       //分亨链接，在链接的网页中打开APP
        global.anysdk.Share(global.selfinfo.nickname,global.roominfo.id);
    },

    //按钮   准备
    Btn_Ready:function(){
        //自动举手
        if(cc.isValid(global.socket) ){
            
            global.socket.SendMsg(5001);
            this.btn_ready.active = false;
        }
    },  

    //切换座位
    Btn_SwitchSeat:function(){
        //5017
      //  global.socket.SendMsg(5017);
    },

    Btn_PlayerList:function(){
        if(this._poplist) return;
        this._poplist = true;
        this.win_playerlist.emit('popout');
    },

    Btn_Exit:function(){
        if(this._status =='')
        global.PopWinTip(1,'确定要退出吗？',this.ExitGame ); 
    else
        global.PopWinTip(1,'游戏已开始，现在退出会严重影响其他玩家的游戏体验，确定要退出吗？',this.ExitGame ); 
    
    },

    Btn_Dice:function(){
        
        if(this._status == 'AS_WAIT_FOR_PLAYER_DICE' )
            global.socket.SendMsg(5003);
        else
            if(this._status == 'AS_WAIT_FOR_BANKER_DICE' || this._status == 'AS_WAIT_FOR_BANKER_CONTINUE_DICE')
                global.socket.SendMsg(5007);

        this.btndice.active = false;       
        this.StopTimer();
    },

    Btn_Set:function(){

        this.win_set.active =true;
    },

    Event_Back:function(){
        if(this._status =='')
            global.PopWinTip(1,'确定要退出吗？',this.ExitGame ); 
        else
            global.PopWinTip(1,'游戏已开始，现在退出会严重影响其他玩家的游戏体验，确定要退出吗？',this.ExitGame ); 
    },

    ExitGame:function(){      
        global.socket.SendMsg(3005);
        cc.director.loadScene('room'); 
    },
    
    CloseSocket:function(){
       // cc.log('socket close');
       global.PopWinTip(2,'与服务器的联接已断开', function(){
           cc.director.loadScene('login');
       }); 
       
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
        switch(seat){
            case this._SELF:    return 0;            
            case this._LEFT:    return 1;               
            case this._TOP:     return 2;          
            case this._RIGHT:   return 3;
        }
    },
   
    GetPlayerSeat:function(seat){

       // cc.log('getplayerseat-----------');
        //cc.log(seat);
        switch(seat){
            case this._LEFT:    return this.seat[1]; 
            case this._TOP:     return this.seat[2]; 
            case this._RIGHT:   return this.seat[3]; 
            case this._SELF:    return this.selfseat; 
        }        
    },

    SaveGame:function(data){
        //记录本局比赛
        cc.log(data);
        this._final_result = data;
        var record = JSON.parse(cc.sys.localStorage.getItem('record'));
        if(record == null)
           record = [];

        //生成战绩记录，
        //取得头像和自己的分数
        var line=[];
        var d = new Date();        
        var score=0;
        for(let i in data){
            if(data[i].id == global.selfinfo.id){
                line.unshift(data[i].id);
                score = data[i].score;
            }else
                line.push(data[i].id);
        }
        line.push(score);
        line.unshift(d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate());       
        record.unshift(line);
        cc.sys.localStorage.setItem('record', JSON.stringify(record));
        //line   2017-8-19  id1  id2  id3   id4  id5   ……………………  1000
    },

    captureScreen: function () {
        //注意，EditBox，VideoPlayer，Webview 等控件无法被包含在截图里面
       //因为这是 OpenGL 的渲染到纹理的功能，上面提到的控件不是由引擎绘制的

        if(CC_JSB) {
            //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
            // var renderTexture = cc.RenderTexture.create(1280,640, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            var cn = cc.Canvas.instance.node;
            
            var renderTexture = cc.RenderTexture.create(cn.width,cn.height);

            //实际截屏的代码
            renderTexture.begin();
            //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
            //this.richText.node._sgNode.visit();

            cn._sgNode.visit();

            renderTexture.end();
            renderTexture.saveToFile("demo.png",cc.ImageFormat.PNG, true, function () {
               // cc.log("capture screen successfully!");
               global.anysdk.ShareImg(jsb.fileUtils.getWritablePath()+'demo.png');
            });
           
            //打印截图路径
            cc.log(jsb.fileUtils.getWritablePath());
        }
    },
    PlaySound:function(id){
        global.ac.emit(id);
    }
/**
    for(let i=1;i<5;i++){        
        for(let j=1;j<13;j++){
        console.log(i+'---'+ j +'------------'+ ((i+j-1)%4));        
    }
    */
});
