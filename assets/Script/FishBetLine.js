 
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Sprite,
        nick:cc.Label,
        direct:cc.Label,

        betnum:cc.Label,
        betslider:cc.Slider,

        _mybet:0,
        _myseat:0,
        

        _bankerbet:0,          
    },
   
    onLoad: function () {
        
        this.node.on('setfisherbet',function(event){

            var msg = event.detail;

            this._bankerbet = msg.bankerbet;

            this.nick.string = msg.nick;
            
            if(msg.head != null)
                this.head.spriteFrame = msg.head;
            
            this._myseat = msg.seat;
            switch(msg.seat){
                case 1:this.direct.string = '南';break;
                case 2:this.direct.string = '西';break;
                case 3:this.direct.string = '北';break;
                case 4:this.direct.string = '东';break;
            }

        },this);    
    },

    onEnable:function(){
        //初始化
        this._mybet=0;
        this._myseat =0;
        this._bankerbet =0;
        this.betnum.string ='0';
        this.betslider.progress=0;         

        this._bankerbet =5000;
    }, 

    SetBetNum:function(){     
        
        this._mybet = 100 * Math.round(this._bankerbet/100*this.betslider.progress);       
        this.betnum.string =this._mybet;

        if(this._mybet > this._bankerbet){
            this.betnum.string = this._bankerbet;       
            this._mybet = this._bankerbet;
        } 
    },

    Btn_FisherBet:function(event,customEventData){
       
        if(customEventData =='2'){
            this.betnum.string =this._bankerbet+'';
            this._mybet = this._bankerbet;           
        }else{          
          
            if( this._mybet > this._bankerbet || this._mybet < 1){
                this.betnum.string = '0';
                this._mybet = 0;                
            }
        }       
        //require('Global').socket.SendMsg(this._method,JSON.stringify([this.betnum.string-0,this._selfseat]));         
    },
  
});
