/*
    Spirolaterals
    Copyright (C) 2010 Zhuowei Zhang

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
"use strict";
/* directions */
/* @constant */
var UP=0;
/* @constant */
var RIGHT=1;
/* @constant */
var DOWN=2;
/* @constant */
var LEFT=3;
/* width of the playing field.
 * @constant */
var FIELD_WIDTH=8;
/* height of the playing field.
 * @constant */
var FIELD_HEIGHT=8;
/* starting x position.
 * @constant */
var DEFAULT_X=4;
/* starting y position.
 * @constant */
var DEFAULT_Y=6;

function calc_steps(arr){ //from Spiralateral activity:  calculates total # of steps for a given pattern
                   // eg [1,2,3,4,5] = (1+2+3+4+5)*4=60
	var sum=0;
	for(var i=0;i<arr.length;i++){
		sum+=arr[i];
	}
	return sum*4;
}
/* @constructor */
function Turtle(pattern){ //Array of 5 ints
	this.x=DEFAULT_X;
	this.y=DEFAULT_Y;
	this.direction=UP;
	this.iterations=0;
	this.pattern=pattern;
	this.curPatternIndex=0;
	this.curPatternLeft=this.pattern[this.curPatternIndex];
	this.iterationsLeft=calc_steps(this.pattern);
	this.horiz=new Array(FIELD_WIDTH);//this.horiz[x_coord][y_coord];
	this.hasHit=false;
	this.done=false;
	for(var i=0;i<this.horiz.length;i++){
		this.horiz[i]=new Array(FIELD_HEIGHT);
		for(var c=0;c<this.horiz[i].length;c++){
			this.horiz[i][c]=false;
		}
	}
	this.verti=new Array(FIELD_WIDTH);
	for(var i=0;i<this.verti.length;i++){
		this.verti[i]=new Array(FIELD_HEIGHT);
		for(var c=0;c<this.verti[i].length;c++){
			this.verti[i][c]=false;
		}
	}
	/* @constructor */
	this.draw=function(){
		switch(this.direction){
			case UP:
				if(this.y-1<0){
					trace("hit");
					this.hasHit=true;
					break;
				}
				this.verti[this.y-1][this.x]=true;  //STUPID ME! the arrays are in [row][column]format
				this.y--;
				
			break;
			case RIGHT:
				this.horiz[this.y][this.x]=true;
				this.x++;
			break;
			case DOWN:
				//down drawing code here
				this.verti[this.y][this.x]=true;
				this.y++;
			break;
			case LEFT:
				//left drawing code here
				if(this.x-1<0){
					trace("hit");
					this.hasHit=true;
					break;
				}
				this.horiz[this.y][this.x-1]=true;
				this.x--;
			break;
			default:
				trace("Unreachable error: switch cannot default in Turtle.draw");
			
		}
		if((this.x<0||this.x>=FIELD_WIDTH||this.y<0||this.y>FIELD_HEIGHT-1)){
			trace("bang! hit wall");
			this.hasHit=true;
			return false;
		}
		if(this.hasHit){
			return false;
		}

		//trace("y: " + this.y+ "x: " + this.x)
		this.curPatternLeft--;
		if(this.curPatternLeft<1){  //done with this number
			this.direction++;
			if(this.direction>LEFT){
				this.direction=UP;
			}
			this.curPatternIndex++;
			if(this.curPatternIndex>=pattern.length){
				this.curPatternIndex=0;

			}
			this.curPatternLeft=this.pattern[this.curPatternIndex];
			//trace("turned to " + this.direction);
		}
		this.iterationsLeft--;
		if(this.iterationsLeft<=0){
			this.done=true;
			trace("done");
		}
		else{
		}

		return true;
	}
}

function sp_drawFull(t){
	while(!(t.done||t.hasHit)){
		t.draw();
	}
	return t;
}

//var test1=new Turtle([3,3,3,3,3]);
//var test2=sp_drawFull(test1);
