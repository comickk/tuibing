cc.Class({
   extends: require("PopWin"),

    properties: {
       
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    noShowAgain:function(){
        //JSON.parse(cc.sys.localStorage.setItem('record'));
        cc.sys.localStorage.setItem('showhelp', JSON.stringify(true));
    }
});
