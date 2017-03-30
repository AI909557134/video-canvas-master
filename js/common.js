(function($,w){
	w.Conf = {
		HOST_URL:"http://test.appserver.com/", //测试IP
	//	HOST_URL:"http://192.168.1.70/", //翁翁IP		
		SHARE:"dynamic/video/web/loadShare", //加载该分享视频
		OTHER:"dynamic/video/web/replaceOther" ,// 其他视频
		LOOKCK:"dynamic/video/web/click", // 计数
	};
	w.Tool = {
		isEmpty:function(str){
	        if(str == "") return true;
	        if(str == null || str == "null") return true;
	        if(str == undefined || str == "undefined") return true;
	        return false;
    	},	    
		terminal:function(){
	        var u = window.navigator.userAgent.toLocaleLowerCase();
	        if(!!u.match(/\([linux;]+( u;)?[android]+/)) return "1";
	        else if(!!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/)) return "0";
	        else return "";
	 	},
	 	getUrl:function(name){
	 		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if (r != null) {
		        return unescape(r[2]);
		    }
		    return null;
	 	},
	 	maFloor:function(s){
	 		var minute = Math.floor(s/60);
			var sesecond = s-Math.floor(s/60)*60;
			if(minute < 10){
				minute = "0"+minute;
			}
			if(sesecond < 10){
				sesecond = "0"+sesecond;
			}
			var rule = minute+":"+sesecond;
			return rule;
	 	},
	 	loadAjax:function(url, data, async, type, dataType, successfn, errorfn){ //ajax
	 		async = (async == null || async == "" || typeof(async) == "undefined") ? "true" : async;
		    type = (type == null || type == "" || typeof(type) == "undefined") ? "post" : type;
		    dataType = (dataType == null || dataType == "" || typeof(dataType) == "undefined") ? "json" : dataType;
		    var srt = JSON.stringify(data);
		    var dataPara = {
		        para: srt
		    };
		    $.ajax({
		        type: type,
		        async: async,
		        data: dataPara,
		        url: url,
		        dataType: dataType,
		        success: function (d) {
		            successfn(d);
		        },
		        error: function (e) {
		            errorfn(e);
		        }
		    });
	 	}
	};
	w.browser = {
		versions : function() {
	        var u = navigator.userAgent, app = navigator.appVersion;
	        return {
	            trident : u.indexOf('Trident') > -1, // IE内核
	            presto : u.indexOf('Presto') > -1, // opera内核
	            webKit : u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
	            gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
	            mobile : !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
	            ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
	            android : u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
	            iPhone : u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
	            iPad : u.indexOf('iPad') > -1, // 是否iPad
	            webApp : u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
	            weixin : u.indexOf('MicroMessenger') > -1, // 是否微信
	            // （2015-01-22新增）
	            qq : u.match(/\sQQ/i) == " qq", // 是否QQ
	            isApp: (u.toLowerCase().indexOf("android-makeba") > -1 || u.toLowerCase().indexOf("ios-makeba") > -1)
	        };
    	}(),
    	language : (navigator.browserLanguage || navigator.language).toLowerCase()
	};
	w.StringBuilder = function() {
		this.__asBuilder = [];
	};
	StringBuilder.prototype.clear = function() {
	    this.__asBuilder = [];
	};
	StringBuilder.prototype.append = function() {
	    Array.prototype.push.apply(this.__asBuilder, arguments);
	    return this;
	};
	StringBuilder.prototype.toString = function() {
	    return this.__asBuilder.join("");
	};
	//下载地址
	var download_addr = "https://boss.makeba.com/official/download.html";
	//判断手机是否是原生App
	if(browser.versions.isApp){		
	    sessionStorage.setItem("isClose",true);
	};
	//判断显示提示下载链接
	if(Tool.isEmpty(sessionStorage.getItem("isClose"))){	
		$(".foot").show();
	};
	w.download = function(i,j){	
		// 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
		// 否则打开a标签的href链接
		var hasApp = true;
		var t1 = Date.now();
		var ifr = document.createElement('iframe');
		if(isWeixn()){
			$('#dl_hint').show();
		    $('body').css("overflow", "hidden");
		    return;
		}else if(browser.versions.ios){
			window.location.href="MadrockChat://";//打开ios应用		
	//		ifr.src = 'MadrockChat://';//打开ios应用			
		}else if(browser.versions.android){
			ifr.src = 'makeba://';//打开android应用
		};		
		ifr.style.display = 'none';
		document.body.appendChild(ifr);
		w.setTimeout(function(){
			document.body.removeChild(ifr);
			var t2 = Date.now();
			if (!t1 || t2 - t1 < 500) {
				hasApp = false;
			}
		},480);
		w.setTimeout(function(){
			if(!hasApp){
				var realAddr = new StringBuilder(), source, resultAddr;
			    realAddr.append(download_addr).append("?flag=".concat(i));
			    realAddr.append("&source=".concat(j));
			    resultAddr = realAddr.toString();
				if(isWeibo()) {
			        // 微博可以直接打开下载链接
			        window.open(resultAddr);
			    }else {
			        window.open(resultAddr);
			    }
			}				
		}, 1000);			
	};
	// 微信中关闭提示
	w.dlHide = function(){
	    $('#dl_hint').hide();
	    $('body').css("overflow","auto");
	};
	// 关闭下载按钮
	w.closeDownBar = function(){
	    sessionStorage.setItem("isClose",true);
	    $("#dl_bar").hide();
	};
	w.isWeixn = function(){
	    var ua = navigator.userAgent.toLowerCase();
	    // $('#is_wx').html(navigator.userAgent);
	    if (ua.match(/MicroMessenger/i) == "micromessenger") {
	        return true;
	    } else {
	        return false;
	    };
	};
	w.isWeibo = function(){
	    var ua = navigator.userAgent.toLowerCase();
	    if (ua.match(/weibo/i) == "weibo") {
	        return true;
	    } else {
	        return false;
	    };
	};
	//	修改title
	w.wxSetTitle= function(title){
	    document.title = title;
	    var mobile = navigator.userAgent.toLowerCase();
	    if (/iphone|ipad|ipod/.test(mobile) && isWeixn()){	    	
	        var iframe = document.createElement('iframe');
	        iframe.style.visibility = 'hidden';
	        iframe.setAttribute('src', 'https://mp.makeba.com/favicon.ico');
	        var iframeCallback = function(){        	
	            setTimeout(function(){
	                iframe.removeEventListener('load', iframeCallback);
	                document.body.removeChild(iframe);
	            }, 0);
	        };
	        iframe.addEventListener('load', iframeCallback);
	        document.body.appendChild(iframe);
	    };
	};
	//  创建video方法
	w.videoShow = function(para){
		newBvd("video",para);
		$(".veo_titl_h1").html(para.title);
		$(".veo_play").html(para.playClicks == undefined ? 1: para.playClicks);
		wxSetTitle(para.title);
		watchClick(para.id);
	};
	// 其他视频点击播放
	w.otherShow = function(elm){
		var para = elm.dataset;
		newBvd("video",para);
		$(".veo_titl_h1").html(para.title);
		$(".veo_play").html(para.playclicks);
		wxSetTitle(para.title);
		watchClick(para.id);
	};
	// 点击观看记录播放量
	w.watchClick = function(videoId){
		var myVideo = document.getElementById('ckplayer_v1');// 获取video元素
		var flag = true;
		myVideo.addEventListener('timeupdate',function(){
			if(myVideo.currentTime >= 3 && flag == true){
				var paraId = {
					videoId:videoId
				};				
				Tool.loadAjax(Conf.HOST_URL+Conf.LOOKCK,paraId,false,null,null,function(d){
					if(d.code == 200){
						flag = false;
					};
				},function(e){
					console.log(e);
				});				
			};
		});			
	};
	//	alert弹框提示
	w.alertShow = {
		show:function(title,type){
			var html = new StringBuilder(),result;	
			html.append("<div class='mask'><div class='alert_box'><p>").append(title).append("</p><div class='col_mask' onclick='alertShow.close()'>").append(type).append("</div></div></div>");
			result = html.toString();
			$("body").append(result);
		},
		close:function(){
			$(".mask").remove();
		}
	};
	//其他视频渲染html字符片段
	w.htmlStr = function(ov){
		var html = "";
		for(var i = 0 ,len = ov.length ;i < len;i++){					
			html += "<div class='flex_box' data-title='"+ ov[i].title +"' data-coverImg='"+ ov[i].coverImg +"' data-url='"+ ov[i].url +"' data-id='"+ ov[i].id +"' data-playClicks='"+ (ov[i].playClicks == undefined ? 1 : ov[i].playClicks) +"' onclick='otherShow(this)'>"+
			"<div class='flex_t' style='background: url("+ ov[i].url +"?vframe/jpg/offset/1) no-repeat center center;background-size:cover;'>"+
			"<span>"+ Tool.maFloor(ov[i].duration) +"</span>"+
			"</div>"+
			"<div class='flex_b'>"+
				"<h3>"+ ov[i].title +"</h3>"+				
			"</div>"+
			"</div>";
		}
		$(".veo_list").html(html);
	};
})(Zepto,window);


