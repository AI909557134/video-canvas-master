//(function($){
    var bvd = function(dom,para){
		var that = this;
//	    $(function(){
	    	that.initVeo(para);
            //获取视频元素
            that.video = document.querySelector(dom || 'video');
            //获取视频父元素
            that.vRoom = that.video.parentNode;
            //获取canvas元素
            that.canvas = document.querySelector('canvas');
            //获取封面img元素
            that.img = document.getElementById('poster');
            //元素初始化
            that.initEm();
            //事件初始化
            that.initEvent();
            //记录信息
        	that.initInfo();
	        //当前播放模式 false 为 mini播放
	        that.isMax = false;
//		});
    };   
   
    var pro = bvd.prototype;
    pro.initVeo = function(para){
    	var w = $("body").width();
    	var h = w*3/4;
    	$("#veo_box").width(w).height(h);
    	var videoHtml = "<video id='ckplayer_v1' playsinline webkit-playsinline poster='"+(para.url == '' ? para.coverImg : para.url+"?vframe/jpg/offset/1")+"'><source src='"+para.url+"' type='video/mp4'></source>当前浏览器不支持 video直接播放，点击这里下载视频： <a href='"+para.url+"'>下载视频</a></video><canvas id='myCanvas'>Your browser does not support the HTML5 canvas tag</canvas><img id='poster' style='width:1px;height:1px' src='"+(para.url == '' ? para.coverImg : para.url+"?vframe/jpg/offset/1")+"'/>";
    	$("#veo_box").html(videoHtml);
    };
    pro.initEm = function(){
        //先添加播放按钮
        this.vimg = document.createElement("img");
        this.vimg.src = 'img/play.png';
        this.vimg.className = 'vplay';
        this.vRoom.appendChild(this.vimg);
        //添加控制条
        this.vC = document.createElement("div");
        this.vC.classList.add('controls');
        this.vC.innerHTML = '<div><div class="progressBar"><div class="timeBar"></div></div></div><div><span class="current">00:00</span>/<span class="duration">00:00</span></div><div><span class="fill"></span></div>';
        this.vRoom.appendChild(this.vC);
    };
    
    function stom(t){
        var m = Math.floor(t / 60);
        m < 10 && (m = '0' + m);
        return m + ":" + (t % 60 / 100).toFixed(2).slice(-2);
    };
    
    //记录信息
	pro.initInfo = function() {
	    var that = this;
	    //在onload状态下，offsetHeight才会获取到正确的值
//	    window.onload = function(){
	        that.miniInfo = {//mini状态时的样式
	            width: that.canvas.offsetWidth + 'px',
	            height: that.canvas.offsetHeight + 'px',
	            position: that.vRoom.style.position,
	            transform: 'translate(0,0) rotate(0deg)'
	        }	
	        var info = [
	                document.documentElement.clientWidth || document.body.clientWidth,
	                document.documentElement.clientHeight || document.body.clientHeigth
	            ],
	            w = info[0],
	            h = info[1],
	            cha = Math.abs(h - w) / 2;	            
	        that.maxInfo = {//max状态时的样式
	            zIndex:99,
                width: h + 'px',
                height: w + 'px',
                position: 'fixed',
                transform: 'translate(-' + cha + 'px,' + cha + 'px) rotate(90deg)'
	        };
//	    };	    	    
	};
	
	//全屏 mini 两种模式切换
	pro.switchOpen = function() {
	    var vR = this.vRoom;
	    //获取需要转换的样式信息
	    var info = this.isMax ? this.miniInfo : this.maxInfo;
	    for(var i in info) {
	        vR.style[i] = info[i];
	    }
	    this.isMax = !this.isMax;
	};
    
    pro.initEvent = function(){
    	var that = this;
    	//增加canvas监听事件
    	var ctx = this.canvas.getContext('2d');
    	ctx.drawImage(this.img, 0 ,0 ,this.canvas.width, this.canvas.height);
		this.video.addEventListener('play', function(){
			i = window.setInterval(function() { 
				ctx.drawImage(that.video, 0, 0, that.canvas.width, that.canvas.height)}, 20);
		}, false);
		this.video.addEventListener('pause', function() { 
			window.clearInterval(i); 
		}, false);
		this.video.addEventListener('ended', function() { 
			window.clearInterval(i); 
		}, false);
        //给播放按钮图片添加事件
        this.vimg.addEventListener('tap',function(){
            that.video.play();
        });
        //canvas点击暂停或播放事件
	    this.canvas.addEventListener('tap',function(){
	        if(that.video.paused || that.video.ended) {
	            //暂停时点击就播放
	            if(that.video.ended){//如果播放完毕，就重头开始播放
	                that.video.currentTime = 0;
	            }          
	            that.video.play();
	        } else {	  
	            //播放时点击就暂停
	            that.video.pause();
	        }
	    });
	    //视频播放事件
	    this.video.addEventListener('play',function(){	    	
	    	that.vC.classList.add('vhidden');
	        that.vimg.style.display = 'none';
	        that.vCt = setTimeout(function(){
        		that.vC.style.visibility = 'hidden';
    		},3400);
	    });
	    //暂停or停止
		this.video.addEventListener('pause',function(){
		    that.vimg.style.display = 'block';
		    that.vC.classList.remove('vhidden');
   			that.vC.style.visibility ='visible';
   			that.vCt && clearTimeout(that.vCt);
		});
        //获取到元数据
        this.video.addEventListener('loadedmetadata',function(){
        	that.vDuration = this.duration;
            that.vC.querySelector('.duration').innerHTML = stom(that.vDuration);
        });
        //视频播放中事件
		this.video.addEventListener('timeupdate', function() {
		    var currentPos = this.currentTime;//获取当前播放的位置
		    //更新进度条
		    var percentage = 100 * currentPos / that.vDuration; 
		    //设置宽度
		    that.vC.querySelector('.timeBar').style.width = percentage + '%';
		    //更新当前播放时间
   			that.vC.querySelector('.current').innerHTML = stom(currentPos);
		});
		//视频手势右滑动事件
		this.canvas.addEventListener('swiperight',function(e){
		    that.video.currentTime += 5;
		});
		//视频手势左滑动事件
		this.canvas.addEventListener('swipeleft',function(e){
		    that.video.currentTime -= 5;
		});
		//全屏按钮
		this.vC.querySelector('.fill').addEventListener('tap',function(){
 			that.switchOpen();
		});
    };
        			    
    var nv = null;
    var newBvd = function(dom,para) {
    	nv = new bvd(dom,para);  
    };
    
//})()