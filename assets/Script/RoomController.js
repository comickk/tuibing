cc.Class({
    extends: require("Controller"),

    properties: {
        
       popbg:cc.Node,
       win_create:cc.Node,
       win_enter:cc.Node,
       win_record:cc.Node,
       win_life:cc.Node,
       win_member:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.popbg.on('touchend',function(){event.stopPropagation();});  

    },

    Btn_Back:function(){
        cc.director.loadScene('login');
    },

    Btn_Set:function(){

    },

    Btn_Record:function(){
        this.win_record.active = !this.win_record.active;
    },

    Btn_Life:function(){
        this.win_life.active = !this.win_life.active;
    },

    Btn_Member:function(){
        this.win_member.active = !this.win_member.active;
    },

    Btn_Create:function(){
        this.win_create.active = true;
    },

    Btn_Enter:function(){
        this.win_enter.active = true;
    },   
});
