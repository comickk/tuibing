cc.Class({
    extends: require("PopWin"),

    properties: {
       graphics:cc.Graphics,
       recordlist:cc.Node,
       recordline:cc.Prefab,

       _gw:10,
       _gh:10,
       _myrecord:null,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this._gw = this.graphics.node.width-8;
        this._gh = this.graphics.node.height-8;        

        var record = JSON.parse(cc.sys.localStorage.getItem('record'));
       
        if(cc.isValid(record)){
            this._myrecord =[];//生成图表原数据
            //画战绩记录
            //"http://"+global.socket.URL+"/client/user/avatar?id="+id;
            var rd = null;//{data:record[0][0],score:record[0][  record[0].length-1    ]-0};//取得第一行数据的日期  和分数
            //this._myrecord.push(rd);

            for(let i in record){
                if( !cc.isValid(rd)){
                    rd = {data:record[i][0],score:record[i][  record[i].length-1    ]-0};
                    this._myrecord.push(rd);
                }else{
                    if(rd.data !== record[i][0]){
                        this._myrecord.push(rd);
                        rd =null;                        
                    }
                    else
                        rd.score += record[i][ record[0].length-1  ]-0;
                }    

                var line = new cc.instantiate(this.recordline);
                line.parent = this.recordlist;
                line.setPosition(0,0);
                line.emit('setrecord',{data:record[i]});                
            }

            this.DrawRecord();
        }
        
    },

    DrawRecord:function(){
        //cc.log(this._myrecord);

        //从右往左画
         this.graphics.moveTo(this._gw - 4,4);

         //取最大高 和最大低
         var max =0;
         var min =0;
         for(let i in this._myrecord){
            if( this._myrecord[i].score-0 > max ) max = this._myrecord[i].score-0;
            if( this._myrecord[i].score-0 < min ) min = this._myrecord[i].score-0;
         }

         //var h =  Math.abs(max) + Math.abs(min) ;//)/this._gh;
         for(let i=0;i<30;i++){
             if(cc.isValid(this._myrecord[i])){
                this.graphics.lineTo( this._gw -4-this._gw/30*i,this.Lerp(max,min,this._myrecord[i].score-0)*this._gh  );
             }else
                this.graphics.lineTo( this._gw -4-this._gw/30*i,this.Lerp(max,min,0)*this._gh  );
         }

        // for(let i=0;i<=20;i++){
        //     this.graphics.lineTo( 4+this._gw/20*i,cc.random0To1()*this._gh  );
        // }     
         this.graphics.stroke();
    },
    Lerp:function(max,min,value){

        var r =  Math.abs(max) + Math.abs(min) ;        

        var v= (value- min)/r;
        //cc.log( '----------'+ max+'     '+ min + '    '+ value+'     '+ v);
        return v;
    }
});
