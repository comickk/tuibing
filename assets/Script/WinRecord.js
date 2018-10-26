cc.Class({
    extends: require("PopWin"),

    properties: {
       graphics:cc.Graphics,
       recordlist:cc.Node,
       recordline:cc.Prefab,


        lab_x:[cc.Label],
        lab_y:[cc.Label],

       _gw:10,
       _gh:10,
       _myrecord:null,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this._gw = this.graphics.node.width-10;
        this._gh = this.graphics.node.height-10;      

        var record = JSON.parse(cc.sys.localStorage.getItem('record'));
        //cc.log(record);       
       
        if(cc.isValid(record)){
            this._myrecord =[];//生成图表原数据
            //画战绩记录
            //"http://"+global.socket.URL+"/client/user/avatar?id="+id;
            var rd = null;//{data:record[0][0],score:record[0][  record[0].length-1    ]-0};//取得第一行数据的日期  和分数
            //this._myrecord.push(rd);

            for(let i in record){

                if( !cc.isValid(rd)){//没有可用记录 则创建
                    rd = {date:record[i][0],score:record[i][  record[i].length-1    ]-0};
                    this._myrecord.push(rd);                    
                }else{
                   //有可用记录，比较是否为同一天
                    if(rd.date !== record[i][0]){  //不为同一天则新建一条记录
                        rd = {date:record[i][0],score:record[i][  record[i].length-1    ]-0};
                        this._myrecord.push(rd);                        
                        //rd =null;                        
                    }
                    else //同一天将分数相加
                        rd.score += record[i][ record[i].length-1  ]-0;
                }    

                var line = new cc.instantiate(this.recordline);
                line.parent = this.recordlist;
                line.setPosition(0,0);
                line.emit('setrecord',{data:record[i]});  
               
            }
           // cc.log(this._myrecord);
            this.DrawRecord();
        };              
    },

    //绘制记录图表
    DrawRecord:function(){
        //cc.log(this._myrecord);      

         //取最大 和最小
         var max =0;
         var min =0;
         for(let i in this._myrecord){            
            if( this._myrecord[i].score-0 > max ) max = this._myrecord[i].score-0;
            if( this._myrecord[i].score-0 < min ) min = this._myrecord[i].score-0;
         }       

         //
         this.lab_y[0].string = min;
         this.lab_y[1].string =Math.round(min+ (max-min)/2);
         this.lab_y[2].string = max;
         
        var mid = this.Lerp(max,min,0)*this._gh;

        //画中间线---------
         this.graphics.moveTo(0,mid);
         this.graphics.lineTo(this._gw,mid);
         var color = cc.Color.BLACK;
         this.graphics.strokeColor = color.fromHEX('#A5A5A5');
         this.graphics.stroke();         
             

         //-----------画柱图-----------------
         var date =null;
         if(cc.isValid(this._myrecord[0]))
            date= this._myrecord[0].date;        

        if(date ==null) return;

        var i=0;

         this.lab_x[2].string = date.slice(5);

         for(let j=0;j<30;j++){
            if(cc.isValid(this._myrecord[i])){              
               // cc.log(this._myrecord[i].date);                
               // cc.log('date = '+ date);

                if(this._myrecord[i].date == date+''){                  
                    
                    if(this._myrecord[i].score-0 >0 ){
                        this.graphics.rect( this._gw-this._gw/30*(j+1),mid,15,this.Lerp(max,min,this._myrecord[i].score-0)*this._gh-mid);
                        this.graphics.fillColor= cc.Color.RED;
                    }else{
                        this.graphics.rect( this._gw-this._gw/30*(j+1),mid,15,this.Lerp(max,min,this._myrecord[i].score-0)*this._gh-mid);
                        this.graphics.fillColor = cc.Color.GREEN;
                    }
                    this.graphics.fill();   
                    i++;  

                }else{
                    //当天没有游戏记录，空过去

                }                                
                //this.graphics.lineTo( this._gw -4-this._gw/30*i,this.Lerp(max,min,this._myrecord[i].score-0)*this._gh  );
            }

            if(j ==14) this.lab_x[1].string = date.slice(5);;
           
            date = this.getLastDay(date);
        }
        this.lab_x[0].string = date.slice(5);;

        // //从右往左画
        // this.graphics.moveTo(this._gw - 4,4);

        //  //var h =  Math.abs(max) + Math.abs(min) ;//)/this._gh;
        //  for(let i=0;i<30;i++){
        //      if(cc.isValid(this._myrecord[i])){
        //         this.graphics.lineTo( this._gw -4-this._gw/30*i,this.Lerp(max,min,this._myrecord[i].score-0)*this._gh  );
        //      }else
        //         this.graphics.lineTo( this._gw -4-this._gw/30*i,this.Lerp(max,min,0)*this._gh  );
        //  }

        // // for(let i=0;i<=20;i++){
        // //     this.graphics.lineTo( 4+this._gw/20*i,cc.random0To1()*this._gh  );
        // // }     
        //  this.graphics.stroke();

        
    },
    
    Lerp:function(max,min,value){

        //var r =  Math.abs(max) + Math.abs(min) ;  
        var r =  max-min ;        

        var v= (value- min)/r;
        //cc.log( '----------'+ max+'     '+ min + '    '+ value+'     '+ v);
        return v;
    },
      //取得之前一天的日期
      getLastDay:function(date){
        
        //cc.log(date);
        //年   月    日
        var d = date.split('-');

        var lastday = new Date(d[0]+'/'+d[1]+'/'+d[2]);

        lastday.setDate(lastday.getDate()-1);

        return lastday.getFullYear()+'-'+(lastday.getMonth()+1)+'-'+lastday.getDate();  
            
    }
});
