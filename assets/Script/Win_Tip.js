
cc.Class({
    extends: require("PopWin"),

    properties: {
        
      tipmsg:'',   
      tiplabel:cc.Label,     
     
      btn_accept:cc.Node,

      btn_cancel:cc.Node,
      btn_exit:cc.Node,     

      _ok_callback:null,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this._scene = '';
        this.node.on('settip',function(event){ //type: 弹窗类型2（提示信息） 1确认关闭 msg:

            if(cc.isValid(event.detail.callback))
                this._ok_callback = event.detail.callback;
             
            if(event.detail.type == 1){                  
                this.btn_cancel.active = true;
                this.btn_exit.active = true;
                this.btn_accept.active = false;
                this.tiplabel.string = '确定要退出吗？';
           }

           if(event.detail.type == 2){               
               this.btn_cancel.active = false;
               this.btn_exit.active = false;
               this.btn_accept.active = true;
               this.tipmsg=event.detail.msg;                
               this.tiplabel.string = this.tipmsg;
           }
        },this);   

        
        this.btn_cancel.on('touchend',function(){  this.Hide();   },this);   

        this.btn_exit.on('touchend',function(){
            //退出程序                     
           var that = this;
           this.BtnOK();          
        },this);

        this.btn_accept.on('touchend',function(){ this.BtnOK() },this);
    },   

    BtnOK:function(){      
       
        if( cc.isValid( this._ok_callback) ){
            this._ok_callback();
            this._ok_callback = null;
        }
        this.Hide();
    },
});
