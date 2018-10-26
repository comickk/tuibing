cc.Class({
    extends: require("PopWin"),

    properties: {
       ed_id:cc.EditBox,
       ed_psw:cc.EditBox,

       login:cc.Node,

       _isnoitpsw:true,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        var id =cc.sys.localStorage.getItem('loginname');
        var psw =cc.sys.localStorage.getItem('loginpass');
       
        if(id != null){
            this.ed_id.string = id;
            if(psw!= null)
                this.ed_psw.string = psw;
        }
    },

    Btn_Login:function(){
        if( this.ed_id.string!='' && this.ed_psw.string != ''){
            this.login.emit('idlogin',{name:this.ed_id.string,psw:this.ed_psw.string,noitpsw:this._isnoitpsw});
            this.Hide();
        }else{
            cc.log('账户或密码不能为空');
        }
    },

    Tog_NoitPSW:function(){
        this._isnoitpsw = !this._isnoitpsw;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
