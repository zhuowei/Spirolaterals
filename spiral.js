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
/* width of a line in pixels.
 * @constant */
var LINE_WIDTH=5;
/* width of the canvas of a field.
 * @constant */
var FIELDCANVAS_WIDTH=450;
/* length of a line.
 * @constant */
var LINE_LENGTH=FIELDCANVAS_WIDTH/FIELD_WIDTH;
/* colors.
 * @constant */
var CANVAS_BACKGROUND_COLOR="#000000";
/* @constant */
var LINE_COLOR="#00ff88";
var compTurtle;
var compTurtle_canvas;
var compTurtle_ctx;
var playerTurtle;
var playerTurtle_canvas;
var playerTurtle_ctx;
var playerPattern=new Array(5);
for(var i=0;i<playerPattern.length;i++){
	playerPattern[i]=1;
}
var internetPattern=false;
var hasWon=false;
var curLevel=0;
var turtleImage=new Array(4);
for(var i=0;i<turtleImage.length;i++){
	turtleImage[i]=new Image();
	turtleImage[i].src="turtle_" + i + ".png";
}
var explosionImage=new Image;
explosionImage.src="explosion.png";
var lifelines=5;
var playerNumberCell=new Array(5);
var test2;
var curLevel=0;
var playerDrawTime=350;
function sp_getPattern(level){
	if(!internetPattern){
		if(level<sp_defaultPatterns.length){
			var retval=new Array(5);
			var tempPattern=sp_defaultPatterns[level];
			for(var i=4;i>=0;i--){
				retval[i]=tempPattern%10;
				tempPattern=parseInt(tempPattern/10);
			}
			return retval;
		}
		else{
			alert("You have won the game!\nNow, try it again with no lifelines!");
			curLevel=0;
			lifelines=-1;
			return sp_getPattern(0);
		}
	}
}
function drawTurtlePattern(ctx, turtle){
	drawPath(ctx, turtle.horiz, turtle.verti);
	drawTurtle(ctx, turtle);
}
function drawTurtle(ctx, turtle){
	ctx.drawImage(turtleImage[turtle.direction], (turtle.x*LINE_LENGTH)-(turtleImage[turtle.direction].width/2), 
		(turtle.y*LINE_LENGTH)-(turtleImage[turtle.direction].width/2));
}
function drawCrash(ctx, turtle){
	trace("crash");
	ctx.drawImage(explosionImage, (turtle.x*LINE_LENGTH)-(turtleImage[turtle.direction].width/2), 
		(turtle.y*LINE_LENGTH)-(turtleImage[turtle.direction].width/2));
}
function drawPath(ctx, horiz, verti){ //draws horiz and vertical patterns onto a canvas
	clear_canvas(ctx);
	ctx.fillStyle=LINE_COLOR;
	//draw horizontal
	for(var r=0;r<horiz.length;r++){
		for(var c=0;c<horiz[r].length;c++){
			if(horiz[r][c]){
				//trace("filling horiz at " + c*LINE_LENGTH + "," + r*LINE_LENGTH  +" " + r + "," + c);
				ctx.fillRect(c*LINE_LENGTH, r*LINE_LENGTH, LINE_LENGTH+LINE_WIDTH, LINE_WIDTH)
			}
		}
	}
	for(var r=0;r<verti.length;r++){
		for(var c=0;c<verti[r].length;c++){
			if(verti[r][c]){
				//trace("filling vertical");
				ctx.fillRect(c*LINE_LENGTH, r*LINE_LENGTH, LINE_WIDTH, LINE_LENGTH+LINE_WIDTH)
			}
		}
	}
}
function clear_canvas(ctx){
	ctx.fillStyle=CANVAS_BACKGROUND_COLOR;
	ctx.fillRect(0,0,FIELDCANVAS_WIDTH, FIELDCANVAS_WIDTH);
}
function comparePaths(t1, t2){ //compares path of two turtles. returns true if same.
	for(var r=0;r<t1.horiz.length;r++){
		for(var c=0;c<t1.horiz[r].length;c++){
			if(t1.horiz[r][c]!=t2.horiz[r][c]){
				return false;
			}
		}
	}
	for(var r=0;r<t1.verti.length;r++){
		for(var c=0;c<t1.verti[r].length;c++){
			if(t1.verti[r][c]!=t2.verti[r][c]){
				return false;
			}
		}
	}
	return true;
}
function init(){
	try{
	compTurtle_canvas=document.getElementById("computer_canvas");
	compTurtle_ctx=compTurtle_canvas.getContext("2d");
	playerTurtle_canvas=document.getElementById("player_canvas");
	playerTurtle_ctx=playerTurtle_canvas.getContext("2d");
	//test2=sp_drawFull(test1);
	//drawPath(compTurtle_ctx, test2.horiz, test2.verti);
	//trace_path(test2.horiz, test2.verti);
	if(!getProgress()){
		trace("no progress saved");
	}
	init_player_controls();
	updateHUD();
	clear_canvas(playerTurtle_ctx);
	start_level();
	changeNumbers();
	if (window.PalmSystem) {
		window.PalmSystem.stageReady();
		window.PalmSystem.setWindowOrientation("free");
	}
	}
	catch(e){
		alert("Spirolaterals has crashed with the following error: " + e);
	}
}
function init_player_controls(){
	for(var i=0;i<5;i++){
		playerNumberCell[i]=document.getElementById("digit_" + i);
		document.getElementById("up_button_digit_" + i).onclick=new Function(("upButtonClicked(" + i + ");"));
		document.getElementById("down_button_digit_" + i).onclick=new Function(("downButtonClicked(" + i + ");"));
	}
	document.getElementById("step").onclick=playerStep;
	document.getElementById("run").onclick=playerStart;
	document.getElementById("bam").onclick=playerDrawFull;
	document.getElementById("hint_button").onclick=giveHint;
	document.getElementById("help_button").onclick=showHelp;
	if(lifelines<=0){
		document.getElementById("hint_button").disabled=true;
	}
	else{
		document.getElementById("hint_button").disabled=false;
	}
}
function __upButtonClicked(digit){
	if(playerPattern[digit]<5){
		playerPattern[digit]++;
	}
	else{
		playerPattern[digit]=1;
	}
	changeNumbers();
}
window["upButtonClicked"]=__upButtonClicked;
function __downButtonClicked(digit){
	if(playerPattern[digit]>1){
		playerPattern[digit]--;
	}
	else{
		playerPattern[digit]=5;
	}
	changeNumbers();
}
window["downButtonClicked"]=__downButtonClicked;
function start_level(){
	var newPattern=sp_getPattern(curLevel);
	compTurtle=new Turtle(newPattern);
	sp_drawFull(compTurtle);
	drawTurtlePattern(compTurtle_ctx, compTurtle);
	updateHUD();
	setHintButtonStatus();
}
function changeNumbers(){
	playerTurtle=new Turtle(playerPattern);
	for(var i=0;i<playerNumberCell.length;i++){
		playerNumberCell[i].innerHTML=playerPattern[i];
	}
}
function trace_path(horiz, verti){ //draws horiz and vertical patterns onto a canvas
	//draw horizontal
	var string="ccc";
	for(var r=0;r<horiz.length;r++){
		for(var c=0;c<horiz[r].length;c++){
				
				string=string+horiz[r][c].toString();
		}
		string=string+"\n";
	}
	string=string+"\naaaaa\n\n";
	for(var r=0;r<verti.length;r++){
		for(var c=0;c<verti[r].length;c++){
				string=string+verti[r][c].toString();

		}
		string=string+"\n";
	}
	alert(string);
}
function playerStep(){
	var retval=true;
	if(!(playerTurtle.done||playerTurtle.hasHit)){
		setHighlight(playerTurtle.curPatternIndex);
		playerTurtle.draw();
		drawTurtlePattern(playerTurtle_ctx, playerTurtle);
		if(playerTurtle.done && playerCheckPattern()){
			setNextLevel();
			retval=false;
		}
		if(playerTurtle.hasHit){
			drawCrash(playerTurtle_ctx, playerTurtle);
			retval=false;
		}
	}
	else{		
		retval=false;		
		trace("done or hit");
		if(playerTurtle.hasHit){
			drawCrash(playerTurtle_ctx, playerTurtle);
		}
		if(playerCheckPattern()){
			setNextLevel();
		}
	}
	return retval;
}
function playerDrawFull(){
	sp_drawFull(playerTurtle);
	drawTurtlePattern(playerTurtle_ctx, playerTurtle);
	if(playerTurtle.done && playerCheckPattern()){
			setNextLevel();
	}
	if(playerTurtle.hasHit){
			drawCrash(playerTurtle_ctx, playerTurtle);
	}
}
function setNextLevel(){
	if(curLevel%3==0&&curLevel>=3&&lifelines>-1){
		lifelines++;
	}
	curLevel++;
	start_level();
}
function playerCheckPattern(){
	for(var r=0;r<playerTurtle.horiz.length;r++){
		for(var c=0;c<playerTurtle.horiz[r].length;c++){
			if(playerTurtle.horiz[r][c]!=compTurtle.horiz[r][c]&&playerTurtle.verti[r][c]!=compTurtle.verti[r][c]){
				trace("no");
				return false;
			}
		}
	}
	trace("yes");
	return true;
}
function saveProgress(){
	try{
		localStorage.sp_level=curLevel.toString();
		localStorage.sp_lifelines=lifelines.toString();
		localStorage.sp_playerPattern=playerPattern.join();
	}
	catch(e){
	}
}
function getProgress(){
	try{
		var level=localStorage.sp_level;
		trace(level);
		if(level==null||typeof(level)=="undefined"||level=="NaN"){
			return false;
		}
		else{
			trace("found");
			curLevel=parseInt(level);
			trace(level);
			lifelines=parseInt(localStorage.sp_lifelines);
			var tempPattern=localStorage.sp_playerPattern.split(",");
			//trace(tempPattern);
			for(var i=0;i<tempPattern.length;i++){
				playerPattern[i]=parseInt(tempPattern[i]);
			}

		}
		return true;
	}
	catch(e){
		return false;
	}
}
function updateHUD(){
	document.getElementById("level").innerHTML="Level: " + curLevel;
	document.getElementById("lifelines").innerHTML="Lifelines: " + (lifelines==-1?"None": lifelines);
}
function giveHint(){
	trace("hint: ");
	if(lifelines>0){
		var found=false;
		for(var i=0;i<playerPattern.length;i++){
			trace(playerPattern[i] + " " + compTurtle.pattern[i]);
			if(playerPattern[i]!=compTurtle.pattern[i]){
				found=true;
				playerPattern[i]=compTurtle.pattern[i];
				break;
			}
		}
		if(!found){
			return;
		}
		lifelines--;
		if(lifelines<=0){
			document.getElementById("hint_button").disabled=true;
		}
		changeNumbers();
		updateHUD();
	}
	else{
		alert("you've run out of hints.");
	}
}
function setHintButtonStatus(){
	document.getElementById("hint_button").disabled=(lifelines<0);
}	
function setHighlight(num){
	for(var i=0;i<5;i++){
		if(i==num){
			trace("highlight: " + i);
			document.getElementById("digit_" + i).style.textShadow="1px 1px 10px yellow, 1px 1px 3px yellow";
			document.getElementById("digit_" + i).style.fontWeight="bold";
		}
		else{
			document.getElementById("digit_" + i).style.textShadow="none";
			document.getElementById("digit_" + i).style.fontWeight="normal";
		}
	}
}
function playerStart(){
	playerDrawTimer=window.setInterval(playerTimerDraw, playerDrawTime);
}
function playerTimerDraw(){
	if(!playerStep()){
		window.clearInterval(playerDrawTimer);
	}
}
function showHelp(){
	trace("help");
	document.getElementById("help_text").style.display="block";
}
function hideHelp(){
	document.getElementById("help_text").style.display="none";
}
function errorHandler(e){
	alert("An error has occurred. " + e.toString());
	return false;
}
function clearProgress(){
	curLevel=0;
	lifelines=5;
	start_level();
}

window.onload=init;
window.onbeforeunload=saveProgress;
window.onerror=errorHandler;
