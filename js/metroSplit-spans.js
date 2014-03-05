$.fn.metroSplit = function(options){
	
	var opt = $.extend({},
		{
			dx : 1,  	//分裂切片左右间距
			dy : 1,		//分裂切片上下间距
			spans : 3	//分裂切片为rank行
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
	
	var _sectionWidth = function(ele,n,spans,w)
	{
		var section = ele;
		var rows = Math.ceil(n/spans);  
		var lastSpans = n-spans*(rows-1);
		var num = section.index();
		var dx = opt.dx/2,dy = opt.dy/2;
		
		section.data({top:dy,right:dx,bottom:dy,left:dx})
		
		if(num%spans == 0) section.data({left:0})
		if(num%spans == spans-1 || num == n-1) section.data({right:0})
		if(num <= spans-1) section.data({top:0})
		if(num >= n - lastSpans) section.data({bottom:0})
		
		section.height(100/rows + "%").css("line-height",section.height() + "px");
		spans = (num < n - lastSpans) ? spans : lastSpans;
		if(w){
			section.width(w/spans + "px")
		}else{
			section.width(Math.floor(100/spans) + "%")
			_IE == 6 || _IE == 7 ? section.width(Math.floor(100/spans) + "%") : section.width(100/spans + "%")
		}
	}
	/* 与上面方法功能相同，以插件调用形式重写了下
	$.fn._sectionWidth = function(n,rank,w)
	{
		return this.each(function()
		{
			var section = $(this);
			var rows = Math.ceil(n/spans);  
			var lastSpans = n-spans*(rows-1);
			
			var num = section.index();
			var dx = opt.dx/2,dy = opt.dy/2;
			
			section.data({top:dy,right:dx,bottom:dy,left:dx})
			
			if(num%spans == 0) section.data({left:0})
			if(num%spans == spans-1 || num == n-1) section.data({right:0})
			if(num <= spans-1) section.data({top:0})
			if(num >= n - lastSpans) section.data({bottom:0})
			
			section.height(100/rows + "%").css("line-height",section.height() + "px");
			spans = (num < n - lastSpans) ? spans : lastSpans;
			if(w){
				section.width(w/spans + "px")
			}else{
				_IE == 6 || _IE == 7 ? section.width(section.width() - 1 + "px") : section.width(100/spans + "%")
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
		
		lis.each(function(){_sectionWidth($(this),len,opt.spans,metro.width())})//初始化每个磁贴子菜单切片的宽、高、位移量
		//lis._sectionWidth(len,opt.spans)  //另一种调用方式
		
		metro.hover(function()
		{
			mainMenu.hide();
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
			}
			,function()
			{
				metro.css({zIndex:1});
				subMenu
					.find("a").each(function()
					{
						var section = $(this).parent();
						var diffTop = "-=" + section.data("top"),
						diffRight = "-=" + section.data("right"),
						diffBottom = "-=" + section.data("bottom"),
						diffLeft = "-=" + section.data("left");
						$(this).stop(true,true).animate({top:diffTop,right:diffRight,bottom:diffBottom,left:diffLeft},"fast")
					})
					.end()
					.css("zIndex","1")
					.delay(200)
					.queue(function(){mainMenu.show();$(this).dequeue();})
			}
		)
	})
}