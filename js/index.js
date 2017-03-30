/*	require基础配置*/
require.config({
	baseUrl: 'js',
	shim:{
		zepto: {
			exports: '$'
		},
		com:{
			exports:"com",
			deps:["zepto"]
		}
	},
	paths: {
		zepto: [
			'https://cdn.bootcss.com/zepto/1.2.0/zepto.min',
			'lib/zepto.min'
		],
		mui:'lib/mui.min',
		com:'common',
		player:'video-mui',		
	}
});
require(["zepto","mui","com","player"],function(){				
	var videoId = Tool.getUrl("videoId"),currentTime = null;
 	if(!Tool.isEmpty(videoId)){
		var para = {
			videoId:videoId  //	 	拉取该id的视频信息
		};
	 	Tool.loadAjax(Conf.HOST_URL+Conf.SHARE,para,false,null,null,function(d){
	 		if(d.code == 200){
	 			var curveido = (typeof d.data == "object") ? d.data : JSON.parse(d.data);
				if(curveido.currentVideo != undefined){
					videoShow(curveido.currentVideo); //渲染当前视频								
				}else{
					var noVideo = {
						coverImg:"https://odoz460dp.bkt.clouddn.com/promotion/img/1f7cb44d-88cb-4013-98a7-7121eaee6cc6.jpg",
						title:"此视频不存在或被删除",
						url:""
					};
					alertShow.show("此视频不存在或被删除！您可以选择热播视频进行观看","确定");						
					videoShow(noVideo);		
				};
	 			currentTime = curveido.currentTime;
				// 其他视频渲染
				var ov = curveido.otherVideos;
				if(ov.length != 0){
					htmlStr(ov);					
				}					
		 	}else{
	 			alertShow.show(d.msg,"确定");
	 		};
	 	},
	 	function(e){
	 		console.log(e);
	 	});
	}else{
		alertShow.show("未能获取到可用参数","取消");
	};
	
//	换一批
	$(document).on("click","#more",function(){
		$(".change").addClass("rotate");
		setTimeout(function(){
			$(".change").removeClass("rotate");			
		},900);			
		if(!Tool.isEmpty(currentTime)){
			var para =  {
				currentTime:currentTime
			};
			Tool.loadAjax(Conf.HOST_URL+Conf.OTHER,para,false,null,null,function(d){
	 			if(d.code == 200){
		 			var curveido = (typeof d.data == "object") ? d.data : JSON.parse(d.data);
		 			currentTime = curveido.currentTime;
					//	其他视频渲染
					var ov = curveido.otherVideos;
					if(ov.length != 0){
						htmlStr(ov);						
					}else{
						alertShow.show("对不起，没有更多视频了，请稍后重新刷新","确定");
					}
		 		}		 						
	 		},
		 	function(e){
		 		console.log(e);
		 	});
		}else{
			alertShow.show("对不起，没有更多视频了，请稍后重新刷新","取消");
		};
	});					    
});


