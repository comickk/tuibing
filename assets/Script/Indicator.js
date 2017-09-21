cc.Class({
    extends: cc.Component,

    properties: {
       num:cc.Label,
       tip:cc.Label,

       bg:cc.Node,
       direct:[cc.Node],

       _seat:0,
       _timelen:0,
       _callback:null,
    },

    // use this for initialization
    onLoad: function () {

        //初始化方位
        this.node.on('initseat',function(event){
            var seat = event.detail.seat;
            this.bg.rotation = -(seat-1)*90;
        },this);

        this.node.on('setindicator',function(event){           

            if( cc.isValid(event.detail.tip))
                this.tip.string = event.detail.tip;

            if( cc.isValid(event.detail.num)){
                this._timelen = event.detail.num;
                this.schedule( function(){ this.Timer() },1,this._timelen,0);
            }

            if( cc.isValid(event.detail.seat)){
                this._seat = event.detail.seat;
                if(this._seat <1){
                    this.direct[1].opacity =255;
                    this.direct[2].opacity =255;
                    this.direct[3].opacity =255;
                    this.direct[4].opacity =255;
                }else{
                    this.direct[1].opacity =0;
                    this.direct[2].opacity =0;
                    this.direct[3].opacity =0;
                    this.direct[4].opacity =0;
                    this.direct[this._seat].opacity =255;
                }
            }

            if( cc.isValid(event.detail.callback))
                this._callback = event.detail.callback;  

        },this);

        this.node.on('stopindicator',function(){
            this.tip.string='';
            this.unscheduleAllCallbacks();
            this._timelen =0;
            this._seat = 0;
            this.num.string ='';
            this.direct[1].opacity =0;
            this.direct[2].opacity =0;
            this.direct[3].opacity =0;
            this.direct[4].opacity =0;
        },this);
    },

    Timer:function(){
        this.num.string = this._timelen;


        this._timelen--;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
