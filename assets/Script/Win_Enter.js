cc.Class({
   extends: require("PopWin"),

    properties: {
        roompsw:cc.EditBox,
    },

    Btn_Start:function(){
         cc.director.loadScene('table');
    }  

});
