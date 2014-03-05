#metroSplit

metroSplit是一个磁贴分裂的效果，为大色块UI菜单增加子菜单维度的解决方案。

请点击[Demo](https://lichking1201.github.io/demo/metroSplit)查看具体效果

##DOM

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
		
##Usage:

	$(".selector").metroSplit(options)

##options:

	dx : 2,  			//分裂切片左右间距，个别浏览器不支持小数像素，尽量使用偶数
	dy : 2,				//分裂切片上下间距，个别浏览器不支持小数像素，尽量使用偶数
	rank : 3,			//分裂切片为rank行
	event : "hover" 	//触发事件，支持"hover"与"click" 
