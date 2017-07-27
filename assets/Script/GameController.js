var GameStep = cc.Enum({
    WAIT:0,
    SELECTBANKER:-1,
    BET:-1,
    SHOW:-1,
});

cc.Class({
    extends: cc.Component,

    properties: {
       imgs:[cc.SpriteFrame],
       point:[cc.SpriteFrame],

       playerpoint:[cc.Sprite],
       pcard:cc.Prefab,
       seat:[cc.Node],
       timeprog:cc.ProgressBar,
       dice:[cc.Node],


       _cards:[cc.Node],
       _cp:0,//牌 索引 指针

       _first:0,//当前发牌起始位

       _player:[],//游戏玩家

       //---方位---
       _selfseat:0,

       _SELF:0,
       _LEFT:0,
       _TOP:0,
       _RIGHT:0,
       //

       //是否有白板
       isHaveBan:true,
       
       //_canvas:cc.Canvas,
    },

    // use this for initialization
    onLoad: function () {
       
       // this._canvas = cc.Canvas.instance;
       //确定方位
        this._selfseat=1;
        this._SELF = this._selfseat;
        this._LEFT = ( (this._selfseat+1)%4==0)?4:(this._selfseat+1)%4;
        this._TOP =  ( (this._selfseat+2)%4==0)?4:(this._selfseat+2)%4;
        this._RIGHT =( (this._selfseat+3)%4==0)?4:(this._selfseat+3)%4;

       
    },

    start:function(){
        
    },

    // update: function (dt) {

    // },

    //添加 玩家------------------
    AddPlayer:function(data){

    },
    //删除玩家
    DelPlayer:function(data){

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
            this._cards[i].parent = cc.Canvas.instance.node;           
            this._cards[i].x =x;
            this._cards[i++].y =y;    
           

            this._cards[i] = cc.instantiate(this.pcard);
            this._cards[i].parent = cc.Canvas.instance.node;
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
    //下注---------------------
    PlayerBet:function(seat,bet){

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

      //  timelen =10;
        this.schedule( function() {               
          
          this.timeprog.progress+=1/timelen*0.2;
           
        }, 0.2, timelen/0.2, 0);
    }
});
