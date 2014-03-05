$.fn.metroSplit = function(options){
	
	var opt = $.extend({},
		{
			dx : 2,  	//分裂切片左右间距
			dy : 2,		//分裂切片上下间距
			rank : 3	//分裂切片为rank行
		},options)

	var wrapBlk = '<div class="backdrop"></div>';
	
	var _IE = (function(){
		var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);
		return v > 4 ? v : false ;
	}());
	
	var _sectionWidth = function(ele,n,rank)
	{
		var section = ele;
		var spans = Math.ceil(n/rank);  
		var lastSpans = n-spans*(rank-1);
		if(n%rank != 0 && lastSpans <= 0 || n<rank){
			rank -= 1;
			return _sectionWidth(section,n,rank)
		}
		
		var num = section.index();
		var dx = opt.dx/2,dy = opt.dy/2;
		
		section.data({top:dy,right:dx,bottom:dy,left:dx})
		
		if(num%spans == 0) section.data({left:0})
		if(num%spans == spans-1 || num == n-1) section.data({right:0})
		if(num <= spans-1) section.data({top:0})
		if(num >= n - lastSpans) section.data({bottom:0})
		
		spans = (num < n - lastSpans) ? spans : lastSpans;
		section.width(100/spans + "%").height(Math.ceil(100/rank) + "%").css("line-height",section.height() + "px");
		if(_IE == 7){
			section.width(section.width() - 1 + "px");
		}
	}
	/* 与上面方法功能相同，以插件调用形式重写了下
	$.fn._sectionWidth = function(n,rank)
	{
		return this.each(function()
		{
			var section = $(this);
			var spans = Math.ceil(n/rank);  
			var lastSpans = n-spans*(rank-1);
			if(n%rank != 0 && lastSpans <= 0 || n<rank){
				rank -= 1;
				return section._sectionWidth(n,rank)
			}
			
			var num = section.index();
			var dx = opt.dx/2,dy = opt.dy/2;
			
			section.data({top:dy,right:dx,bottom:dy,left:dx})
			
			if(num%spans == 0) section.data({left:0})
			if(num%spans == spans-1 || num == n-1) section.data({right:0})
			if(num <= spans-1) section.data({top:0})
			if(num >= n - lastSpans) section.data({bottom:0})
			
			spans = (num < n - lastSpans) ? spans : lastSpans;
			section.width(100/spans + "%").height(100/rank + "%").css("line-height",section.height() + "px");
			if(_IE == 7){
				section.width(section.width() - 1 + "px");
			}	
		})
	}
	*/
	
	return this.each(function()
	{
		var metro = $(this);
		var mainMenu = metro.find(".metroSplit-main"),
			subMenu = metro.find(".metroSplit-sub");
		var lis = subMenu.find("li"),
			len = lis.length;
		
		lis.each(function(){_sectionWidth($(this),len,opt.rank)})//初始化每个磁铁子菜单切片的宽高
		//lis._sectionWidth(len,opt.rank)
		metro.on("click",function()
		{
			mainMenu.fadeOut();
			metro.css({zIndex:99999});
			subMenu
				.css("zIndex","99")
				.find("a").each(function()
				{
					var section = $(this).parent();
					var diffTop = "+=" + section.data("top"),
						diffRight = "+=" + section.data("right"),
						diffBottom = "+=" + section.data("bottom"),
						diffLeft = "+=" + section.data("left");
					$(this).animate({top:diffTop,right:diffRight,bottom:diffBottom,left:diffLeft},"fast")
				})

			$(wrapBlk).appendTo($("body")).on("click",function()
			{
				$(this).remove();
				metro.css({zIndex:1});
				subMenu
					.find("a").each(function()
					{
						var section = $(this).parent();
						var diffTop = "-=" + section.data("top"),
						diffRight = "-=" + section.data("right"),
						diffBottom = "-=" + section.data("bottom"),
						diffLeft = "-=" + section.data("left");
						$(this).animate({top:diffTop,right:diffRight,bottom:diffBottom,left:diffLeft},"fast")
					})
					.end()
					.css("zIndex","1")
					.delay(200)
					.queue(function(){mainMenu.fadeIn();$(this).dequeue();})
			})
		})
	})
}