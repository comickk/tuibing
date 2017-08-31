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

       // _showbetnum:false,
    },

    // use this for initialization
    onLoad: function () {        
        this.betnum.node.opacity=0;
    },
    
    SetBetNum:function(){       
               
        if(this.betnum.node.opacity==0) 
            this.betnum.node.opacity =255;         

        this.betnum.string = 10 * Math.round(10*this.betslider.progress);
    },

    Btn_PlayerBet:function(event,customEventData){
        cc.log(this.betnum.string);
        this.betnum.node.opacity=0;
    },

    Btn_BankerBet:function(event,customEventData){ 
        cc.log(customEventData);
        switch(customEventData){
            case '200':
                this.bankbtn1.interactable = false;
            break;
            case '300':
                this.bankbtn1.interactable = false;
                this.bankbtn2.interactable = false;
            break;
            case '500':
                this.bankbtn1.interactable = false;
                this.bankbtn2.interactable = false;
                this.bankbtn3.interactable = false;
            break;
        }
    },
});
