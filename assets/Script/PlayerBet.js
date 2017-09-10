cc.Class({
    extends: cc.Component,

    properties: {
        bankbet:cc.Node,
        playerbet:cc.Node,

        bankbtn1:cc.Button,
        bankbtn2:cc.Button,
        bankbtn3:cc.Button,

       // btn_bet:cc.Node,
        betnum:cc.Label,
        betslider:cc.Slider,

        _type:1,
        _bankerbet:0,

        _method:0,
       // _showbetnum:false,
    },

    // use this for initialization
    onLoad: function () {        
        this.betnum.node.opacity=0;

        this.node.on('showbtn',function(event){ this.playerbet.active = true;  
            this.betslider.progress =0;
            this._method =event.detail.method;
            this._bankerbet = event.detail.bet;
        },this);

        this.node.on('showbankerbtn',function(event){ 
            this._method =event.detail.method;
            this.bankbet.active = true; 
         },this);     

        this.node.on('autobet',this.AutoBet,this); 
        this.node.on('rest',function(){
            this.bankbtn1.interactable = true;
            this.bankbtn2.interactable = true;
            this.bankbtn3.interactable = true;
        },this);

        this.node.on('hidebankerbtn',function(event){
            if(event.detail.bet >0)  this.bankbtn1.interactable = false;
            if(event.detail.bet >200)  this.bankbtn2.interactable = false;
            if(event.detail.bet >300)  this.bankbtn3.interactable = false;
            this.bankbet.active = false; 
        },this);
    },
    
    SetBetNum:function(){       
               
        if(this.betnum.node.opacity==0) 
            this.betnum.node.opacity =255;         

        //this.betnum.string = this._bankerbet/10+ this._bankerbet/10 * Math.round(9*this.betslider.progress);
        this.betnum.string = 10 * Math.round(this._bankerbet/10*this.betslider.progress);
    },

    Btn_PlayerBet:function(event,customEventData){
        cc.log(this.betnum.string);
        //var bet = Number(customEventData);
        //if(bet ==1) 
        if(customEventData =='2'){
            this.betnum.string =this._bankerbet+'';
        }else{
            var bet = Number(this.betnum.string);
            if( bet > this._bankerbet || bet < 10)
                this.betnum.string = 10;
        }
        this.betnum.node.opacity=0;
        require('Global').socket.SendMsg(this._method,this.betnum.string-0); 
        this.playerbet.active = false;
    },

    Btn_BankerBet:function(event,customEventData){ 
        cc.log(customEventData);
        var bet =200;
        switch(customEventData){
            case '200':
                this.bankbtn1.interactable = false;
            break;
            case '300':
                bet =300;
                this.bankbtn1.interactable = false;
                this.bankbtn2.interactable = false;
            break;
            case '500':
                bet = 500;
                this.bankbtn1.interactable = false;
                this.bankbtn2.interactable = false;
                this.bankbtn3.interactable = false;
            break;
        }
        require('Global').socket.SendMsg(this._method,bet);        
        this.bankbet.active = false;
    },

    AutoBet:function(){
        if(this.bankbet.active){
            if(this.bankbtn1.interactable){
                this.Btn_BankerBet(null,'200');
                return;
            }

            if(this.bankbtn2.interactable){
                this.Btn_BankerBet(null,'200');
                return;
            }

            if(this.bankbtn3.interactable){
                this.Btn_BankerBet(null,'200');
                return;
            }

            cc.log('无法续锅');
            this.bankbet.active = false;
            return;
        }

        if(this.playerbet.active){
            this.betnum.string='10';
            this.Btn_PlayerBet(null,'1');
        }
    },
});
