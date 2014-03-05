/*
 * metroSplit v1.1 
 * Date: 2014-3-5
 * https://github.com/lichking1201/metroSplit
 * (c) 2013-2014 lichking, http://lichking1201.github.io
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 *
 */

 /*
 @DOM
	<div class="selector">
		<div class="metroSplit-main">
			... main-menu's code...
		</div>
		<div class="metroSplit-sub">
			<ul>
				<li><a>...submenu's code...</a></li>
				<li><a>...submenu's code...</a></li>
				<li><a>...submenu's code...</a></li>
			</ul>
		</div>
	</div>
	
 @Usage
	$(".selector").metroSplit(options)
 */
 
$.fn.metroSplit = function(options){
	
	var opt = $.extend({},
		{
			dx : 2,  		//分裂切片左右间距
			dy : 2,			//分裂切片上下间距
			rank : 3,		//分裂切片为rank行
			event : "hover" //触发事件，支持"hover"与"click" 
		},options)
	
	var WARP_BLK = '<div style="position:fixed;left:0;top:0;bottom:0;right:0;z-index:999;"></div>';
	
	//IE 判断
	var _IE = (function(){
		var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);
		return v > 4 ? v : false ;
	}());
	
	//确定切片宽高与位移量，参数为切片节点li的jQuery对象、li的length、需要分裂的行数rank
	var _sectionWidth = function(ele,n,rank,w)
	{
		var w = w || {}
		var section = ele;
		var spans = Math.ceil(n/rank);  	//每排切片数量；n可能无法正处rank，最后一排无法排满，最后一排特殊对待，拉伸宽度填充。
		var lastSpans = n-spans*(rank-1);	//最后一排切片数量
		
		//切片总数小于要分裂的行数，或者切片无法铺满metro时，减少rank直到适配；
		if(n%rank != 0 && lastSpans <= 0 || n<rank){
			rank -= 1;
			return _sectionWidth(section,n,rank)
		}
		
		var num = section.index();
		var dx = opt.dx/2,dy = opt.dy/2; //每个切片位移期望值的一半，对称分离
		
		section.data({top:dy,right:dx,bottom:dy,left:dx}) //初始化位移量
		
		if(num%spans == 0) section.data({left:0})	//左起第一纵列切片，已经贴边，不需要再像左侧移动
		if(num%spans == spans-1 || num == n-1) section.data({right:0})	//右起第一纵列切片
		if(num <= spans-1) section.data({top:0})	//顶头第一排切片
		if(num >= n - lastSpans) section.data({bottom:0})	//末尾最后一排切片
		
		spans = (num < n - lastSpans) ? spans : lastSpans;	//确定当前切片所在行共有多少切片
		section.width(100/spans + "%").height(Math.ceil(100/rank) + "%").css("line-height",section.height() + "px");	//根据spans、rank计算切片宽高、行高。在某些浏览器中对小数宽度渲染精度较差，所以高度百分比向上取整，metro设置overflow:hidden 隐藏多出的差值。
		if(_IE == 7 && num%spans == 0 && spans != 1){
			section.width(w - section.width()*(spans-1) + "px"); //IE7对百分比宽度计算有误差，所以重新计算宽度减去差值确保填充满metro。
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
		var W = metro.width() //用于HACKie7
		lis.each(function(){_sectionWidth($(this),len,opt.rank,W)})//初始化每个磁铁子菜单切片的宽、高、位移量
		//lis._sectionWidth(len,opt.rank)
		if(opt.event == "hover") metro.hover(_star,_stop)
		if(opt.event == "click") metro.on("click",function()
		{
			_star();
			$(WARP_BLK).appendTo($("body")).on("click",function()
			{
				$(this).remove();
				_stop();
			})
		})
		
		function _star()
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
		
		function _stop()
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
					$(this).animate({top:diffTop,right:diffRight,bottom:diffBottom,left:diffLeft},"fast")
				})
				.end()
				.css("zIndex","1")
				.delay(200)
				.queue(function(){mainMenu.stop(true,true).fadeIn();$(this).dequeue();})
		}
	})
}