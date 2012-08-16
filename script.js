var num_rows;
var num_grids;
var num_mines;
var mine_value="*";
var num_helper_cells;
var count;
var isClicked;
var mines = [];
var grids = [];
var stack = [];
var spread = [];

var row = function(length){
	return Math.floor(length/num_rows);
};

var col = function(length){
	return length%num_rows;
};

var value = function(r,c){
	return r*num_rows+c;
};

var generateMines = function(){
	var mine;
	while(mines.length!==num_mines)
	{
		mine=Math.floor(Math.random()*num_grids);
		if(mines.indexOf(mine)===-1)
		mines.push(mine);
	}
};

var generateGrids = function(){
	var i,j;
	for(i=0;i<num_rows;i++)
	{
		grids.push([]);
	}
	
	for(i=0;i<num_rows;i++)
	{
		for(j=0;j<num_rows;j++)
		{
			grids[i][j]=0;
		}
	}
	
	for(i=0;i<num_mines;i++)
	{
		j=mines[i];
		grids[row(j)][col(j)]=mine_value;
	}
};

var check = function(length){
	var main_row = row(length);
	var main_col = col(length);
	var test_row,test_col,test_length;
	var myArray = [];
	
	test_length=length-num_rows-1;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row>=0 && (test_row===main_row-1))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length-num_rows;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row>=0 && (test_row===main_row-1))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length-num_rows+1;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row>=0 && (test_row===main_row-1))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length-1;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row>=0 && (test_row===main_row))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length+1;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row<num_rows && (test_row===main_row))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length+num_rows-1;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row<num_rows && (test_row===main_row+1))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length+num_rows;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row<num_rows && (test_row===main_row+1))
	{
		myArray.push(value(test_row,test_col));
	}
	
	test_length=length+num_rows+1;
	test_row=row(test_length);
	test_col=col(test_length);
	if(test_row<num_rows && (test_row===main_row+1))
	{
		myArray.push(value(test_row,test_col));
	}
	
	return myArray;
};

var checkSpread = function(index){
	var a;
	stack.push(index);
	while(stack.length>0)
	{
		a=stack.pop();
		if(spread.indexOf(a)===-1)
		{
			spread.push(a);
			if(grids[row(a)][col(a)]===0)
			$.merge(stack,check(a));
		}
	}
};

var generateValues = function(){
	var i,j,val_array,array_length;
	for(i=0;i<num_mines;i++)
	{
		val_array=check(mines[i]);
		array_length=val_array.length;
		for(j=0;j<array_length;j++)
		{
			row_index=row(val_array[j]);
			col_index=col(val_array[j]);
			if(grids[row_index][col_index]!==mine_value)
			grids[row_index][col_index]++;
		}
		val_array=[];
	}
};

var showAll = function($var){
	var index=$var.index();
	var $grids=$var.parent().children('div');
	$grids.each(function(i,val){
		if(i===index)
		{
			if(!$var.hasClass("clicked"))
			{
				$var.addClass("bomb");
				$var.removeClass("flag-big");
				$var.removeClass("flag-small");
				$var.html(grids[row(index)][col(index)]);
			}
		}
		else
		{
			$(val).addClass("clicked");
			$(val).removeClass("flag-big");
			$(val).removeClass("flag-small");
			if(grids[row(i)][col(i)]!==0)
			$(val).html(grids[row(i)][col(i)]);
		}
	});
	if(!$var.hasClass("clicked") && !$var.hasClass("alert"))
	{
		$var.addClass("alert");
		alert("Oops!!! You hit the mine.");
	}
	
	$var.parent().addClass("lost");
};

var show = function($var){
	var index = $var.index();
	var $grids = $var.parent().children('div');
	var value=grids[row(index)][col(index)];
	var i,spread_length,$current;
	if(value===mine_value)
	{
		showAll($var);
	}
	else if(value===0)
	{
		stack=[];
		spread=[];
		checkSpread(index);
		spread_length=spread.length;
		for(i=0;i<spread_length;i++)
		{
			$current = $grids.eq(spread[i]);
			if(!$current.hasClass('clicked') && !$current.hasClass('flag-big') && !$current.hasClass('flag-small'))
			{
				$current.addClass('clicked');
				if(grids[row(spread[i])][col(spread[i])]!==0)
				$current.html(grids[row(spread[i])][col(spread[i])]);
				count++;
			}
		}
	}
	else
	{
		if(!$var.hasClass('clicked'))
		{		
			$var.addClass('clicked');
			$var.html(value);
			count++;
		}
	}
	
	if(!isClicked)
	isClicked=true;
};

var reload = function($var,index){
	count=0;
	isClicked=false;
	mines = [];
	grids = [];
	stack = [];
	spread = [];
	
	$var.removeClass("won");
	$var.removeClass("lost");
	
	switch(index)
	{
		case 0:
			num_rows=9;
			num_grids=num_rows*num_rows;
			num_mines=10;
			num_helper_cells=num_grids-num_mines;
			for(i=0;i<num_grids;i++)
			$var.append('<div class="cell-big"></div>');
			break;
		case 1:
			num_rows=15;
			num_grids=num_rows*num_rows;
			num_mines=35;
			num_helper_cells=num_grids-num_mines;
			for(i=0;i<num_grids;i++)
			$var.append('<div class="cell-small"></div>');
			break;
		case 2:
			num_rows=15;
			num_grids=num_rows*num_rows;
			num_mines=48;
			num_helper_cells=num_grids-num_mines;
			for(i=0;i<num_grids;i++)
			$var.append('<div class="cell-small"></div>');
			break;
	}
	
	generateMines();
	generateGrids();
	generateValues();
};

var clickGrid = function($var,index){
	var flag;
	switch(index)
	{
		case 0:
			flag="flag-big";
			break;
		case 1:
			flag="flag-small";
			break;
		case 2:
			flag="flag-small";
			break;
	}
	$var.children('div').mouseup(function(e){
		if(!$var.hasClass('won'))
		{
			switch(e.which)
			{
				case 1:
					if(!$(this).hasClass(flag))
					show($(this));
					break;
				case 3:
					if(!$(this).hasClass('clicked') && !$(this).hasClass('bomb'))
					$(this).toggleClass(flag);
					break;
			}
			if(count===num_helper_cells)
			{
				alert("Congratulations!!! You won the game.");
				$var.addClass('won');
			}
		}
	});
};

$(document).ready(function(){
	var $main=$('#main');
	var $reload=$('#reload');
	var $container=$('#container');
	var tab_index,reload_game;
	$main.tabs();
	$reload.button();
	
	$container.on("contextmenu",function(e){
	return false;
	});
	
	tab_index=$main.tabs("option","selected");
	//$container.empty();
	reload($container,tab_index);
	clickGrid($container,tab_index);
	
	$main.on("tabsselect",function(e,ui){
		
		if($container.hasClass('won') || $container.hasClass('lost'))
		{
			tab_index=ui.index;
			$container.empty();
			reload($container,tab_index);
			clickGrid($container,tab_index);
		}
		else if(isClicked)
		{
			reload_game = confirm("Do you really want to change the level?");
			if(reload_game)
			{
				tab_index=ui.index;
				$container.empty();
				reload($container,tab_index);
				clickGrid($container,tab_index);
			}
			else
			return false;
		}
		else
		{
			tab_index=ui.index;
			$container.empty();
			reload($container,tab_index);
			clickGrid($container,tab_index);
		}
	});
	
	
	$reload.click(function(){
		if($container.hasClass('won') || $container.hasClass('lost'))
		{
			tab_index=$main.tabs("option","selected");
			$container.empty();
			reload($container,tab_index);
			clickGrid($container,tab_index);
		}
		else if(isClicked)
		{
			reload_game = confirm("Do you really want to start a new game?");
			if(reload_game)
			{
				tab_index=$main.tabs("option","selected");
				$container.empty();
				reload($container,tab_index);
				clickGrid($container,tab_index);
			}
		}
		else
		{
			$container.children('div').removeClass("flag-big");
			$container.children('div').removeClass("flag-small");
		}
	});
});