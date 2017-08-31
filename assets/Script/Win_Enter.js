cc.Class({
   extends: require("PopWin"),

    properties: {
        roompsw:cc.EditBox,
    },

    Btn_Start:function(){       
      
        require('Global').socket.SendMsg(3007,this.roompsw.string);
    }  

});
