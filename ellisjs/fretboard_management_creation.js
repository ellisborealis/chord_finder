// constants
var chords = [
		{"intervals":[0,4,8],"name":"Augmented"},
		{"intervals":[0,4,7,10,2,6],"name":"Augmented eleventh"},
		{"intervals":[0,4,8,11],"name":"Augmented major seventh"},
		{"intervals":[0,4,8,10],"name":"Augmented seventh"},
		{"intervals":[0,6,8],"name":"Augmented sixth"},
		{"intervals":[0,3,6],"name":"Diminished"},
		{"intervals":[0,3,6,11],"name":"Diminished major seventh"},
		{"intervals":[0,3,6,9],"name":"Diminished seventh"},
		{"intervals":[0,5,6,7],"name":"Dream"},
		{"intervals":[0,7,9,1,4],"name":"Elektra"},
		{"intervals":[0,8,11,4,9],"name":"Farben"},
		{"intervals":[0,4,7,10],"name":"Harmonic seventh"},
		{"intervals":[0,4,7,10,3],"name":"Hendrix"},
		{"intervals":[0,4,7,11,6],"name":"Lydian"},
		{"intervals":[0,4,7],"name":"Major"},
		{"intervals":[0,4,7,11,2,5],"name":"Major eleventh"},
		{"intervals":[0,4,7,11],"name":"Major seventh"},
		{"intervals":[0,4,7,11,6],"name":"Major seventh sharp eleventh"},
		{"intervals":[0,4,7,9],"name":"Major sixth"},
		{"intervals":[0,4,7,11,2],"name":"Major ninth"},
		{"intervals":[0,4,7,11,2,6,9],"name":"Major thirteenth"},
		{"intervals":[0,3,7],"name":"Minor"},
		{"intervals":[0,3,7,10,2,5],"name":"Minor eleventh"},
		{"intervals":[0,3,7,11],"name":"Minor major seventh"},
		{"intervals":[0,3,7,10,2],"name":"Minor ninth"},
		{"intervals":[0,3,7,10],"name":"Minor seventh"},
		{"intervals":[0,3,6,10],"name":"Half-diminished seventh"},
		{"intervals":[0,3,7,9],"name":"Minor sixth"},
		{"intervals":[0,3,7,10,2,5,9],"name":"Minor thirteenth"},
		{"intervals":[0,2,4,7],"name":"Major add 9"},
		{"intervals":[0,2,3,7],"name":"Minor add 9"},
		{"intervals":[0,6,10,4,9,2],"name":"Mystic"},
		{"intervals":[1,5,8],"name":"Neapolitan"},
		{"intervals":[0,4,8,10,2],"name":"Ninth augmented fifth"},
		{"intervals":[0,4,6,10,2],"name":"Ninth flat fifth"},
		{"intervals":[1,2,8,0,3,6,7,10,11,4,7],"name":"Northern Lights"},
		{"intervals":[0,1,4,5,8,9],"name":"Ode-to-Napoleon hexachord"},
		{"intervals":[0,1,4,6,7,10],"name":"Petrushka"},
		{"intervals":[0,7],"name":"Power"},
		{"intervals":[0,4,7,9,10],"name":"Seven six"},
		{"intervals":[0,4,7,10,1],"name":"Seventh flat nine"},
		{"intervals":[0,5,7,10],"name":"Seventh suspension four"},
		{"intervals":[0,4,7,9,2],"name":"Sixth ninth"},
		{"intervals":[0,5,7],"name":"Suspended 4"},
		{"intervals":[0,2,7],"name":"Suspended 2"},
		{"intervals":[0,5,10,3,7],"name":"So What"},
		{"intervals":[0,4,7,10,1,9],"name":"Thirteenth flat ninth"},
		{"intervals":[0,4,6,10,1,9],"name":"Thirteenth flat ninth flat fifth"},
		{"intervals":[0,1,6],"name":"Viennese trichord"},
		{"intervals":[0,6,7],"name":"Viennese trichord"},
		//{"intervals":[],'name':''},
	];

var instrumentSelector = [
		{"instrument":"guitar","fretCount":17,"startingValues":"E2,A2,D3,G3,B3,E4","stringCount":6},
		{"instrument":"bass","fretCount":17,"startingValues":"E1,A1,D2,G2","stringCount":4},
		{"instrument":"ukulele","fretCount":17,"startingValues":"G4,C4,E4,A4","stringCount":4},
		{"instrument":"bariuke","fretCount":17,"startingValues":"D3,G3,B3,E4","stringCount":4},
		{"instrument":"mandolin","fretCount":17,"startingValues":"G3,D4,A4,E5","stringCount":4},
		{"instrument":"bouzouki","fretCount":17,"startingValues":"C3,F3,A3,D4","stringCount":4},
	];

var noteLetterOffset = new Object();
noteLetterOffset["A"] = 0;
noteLetterOffset["B"] = 2;
noteLetterOffset["C"] = -9;
noteLetterOffset["D"] = -7;
noteLetterOffset["E"] = -5;
noteLetterOffset["F"] = -4;
noteLetterOffset["G"] = -2;

var circleMap = new Array();
circleMap.push(0);
circleMap.push(0);
circleMap.push(1);
circleMap.push(0);
circleMap.push(1);
circleMap.push(0);
circleMap.push(1);
circleMap.push(0);
circleMap.push(0);
circleMap.push(1);
circleMap.push(0);
circleMap.push(2);

var fretOpacity = '0.0';

function notesPerScale()
{
	return 12;
}
function numOffsetPerOctave()
{
	return 7;
}

function assignArguments()
{
	var instrument = document.getElementById("instrumentSelection").value;
	for(instIdx = 0; instIdx < instrumentSelector.length; instIdx++)
	{
		if(instrument == instrumentSelector[instIdx].instrument)
		{
			numFrets = instrumentSelector[instIdx].fretCount;
			numStrings = instrumentSelector[instIdx].stringCount;
			var tempOffset = instrumentSelector[instIdx].startingValues.split(",");
			for (a in tempOffset ) {
				offset[a] = convertNumberedLetterToOffset(tempOffset[a]);
			}
		}
	}
}

// d3 functions
function createGraph()
{
	answerObject = createFretBoard(numFrets, numStrings, offset, nutSize);
	instantiatedFretDecorations = answerObject.fretOrnaments;
	instantiatedStrings = answerObject.strings;
	instantiatedFretBoard = answerObject.fretBoard;
	instantiatedDots = answerObject.dots;
	d3.select("svg#main").remove();
	svg = d3
		.select("body")
		.append("svg")
		.attr("id","main")
		.attr("width", w)
		.attr("height", h);
	xScale = d3.scale.linear()
		.domain([0, d3.max(instantiatedFretBoard, function(d) { return d.fretPosX; })])
		.range([0, h-heightOffset]);
	staffScaleX = d3.scale.linear()
		.domain([-6,6]) // not adaptive, will not change
		.range([w-160,w]);
	staffScaleY = d3.scale.linear()
		.domain([-15,10]) // not adaptive, will not change
		.range([220,20]);
	d3.select("div#value").remove();
	d3.select("div#answerDiv").remove();
	div = d3.select("body")
		.append("div")
		.attr("id","value")
		.attr("class", "tooltip")
		.style("opacity", 0);
	answerDiv = d3.select("body")
		.append("div")
		.attr("id","answerDiv")
		.attr("class", "tooltip")
		.style("opacity", 1.0);

	// neck
	svg.selectAll("rect#neck")
		.data([1])
		.enter()
		.append("rect")
		.attr("id","neck");

	// head
	svg.selectAll("rect#head")
		.data([1])
		.enter()
		.append("rect")
		.attr("id","head");

	// fret metal
	svg.selectAll("rect#fretMetal")
		.data(instantiatedFretDecorations)
		.enter()
		.append("rect")
		.attr("id","fretMetal");

	// fret decorations
	svg.selectAll("circle#fretDecoration")
		.data(instantiatedDots)
		.enter()
		.append("circle")
		.attr("id","fretDecoration");

	// strings
	svg.selectAll("rect#strings")
		.data(instantiatedStrings)
		.enter()
		.append("rect")
		.attr("id","strings");

	// fretboard
	fretSvg = svg.selectAll("rect#fret")
		.data(instantiatedFretBoard)
		.enter()
		.append("rect")
		.attr("id", "fret")
		.style({opacity:fretOpacity})
		.on('mouseover', function(d)
			{
				var nodeSelection = d3.select(this).style({opacity:'0.5'});
				div.transition()
					.duration(transitionDuration)
					.style("opacity", 0.9);
				div.html(d.noteLetter + "<br/>" + d.noteFrequency + "<br/>")
					.style("left", (w - leftSide - 10) + "px")
					.style("top", (360) + "px");
			}
		)
		.on('mouseout', function(d)
			{
				var thisOpacity = fretOpacity;
				if(d.activeFlag)
				{
					thisOpacity = 1.0;
				}
				var nodeSelection = d3.select(this).style({opacity:thisOpacity});
				div.transition()
					.duration(transitionDuration)
					.style("opacity", 0);
			}
		)
		.each(function(d)
			{
				d3.select(this).on('click', function()
					{
						if(d.activeFlag)
						{
							d.activeFlag = false;
						}
						else
						{
							// clear all frets on string
							for(i = 0; i < instantiatedFretBoard.length; i++)
							{
								instantiatedFretBoard[i].xOffset = 0;
								if(instantiatedFretBoard[i].stringIndex == d.stringIndex)
								{
									instantiatedFretBoard[i].activeFlag = false;
								}
							}
							// set fret pressed
							d.activeFlag = true;
						}
						var answerChords = findPossibleListOfChords(instantiatedFretBoard);
						calculatedChords = "";
						var commaString = "";
						for(ansIdx = 0; ansIdx < answerChords.length; ansIdx++)
						{
							calculatedChords = (calculatedChords + commaString + answerChords[ansIdx]);
							commaString = ", ";
						}
						refreshGraph();
					}
				)
			}
		);

	// notes
	staffSvg = svg.selectAll("path#notes")
		.data(instantiatedFretBoard)
		.enter()
		.append("path")
		.attr("id", "notes")
		.attr("opacity",0);
	
	// sharps
	textSvg = svg.selectAll("path#sharps")
		.data(instantiatedFretBoard)
		.enter()
		.append("path")
		.attr("id","sharps")
		.attr("opacity",0);
	
	// flats
	textSvg = svg.selectAll("path#flats")
		.data(instantiatedFretBoard)
		.enter()
		.append("path")
		.attr("id","flats")
		.attr("opacity",0);
	
	// double sharps
	textSvg = svg.selectAll("path#doubleSharps")
		.data(instantiatedFretBoard)
		.enter()
		.append("path")
		.attr("id","doubleSharps")
		.attr("opacity",0);

	// answer box
	chordAnswerSvg = svg.selectAll("text#answer")
		.data(calculatedChords)
		.enter()
		.append("text")
		.attr("id","answer");
		
	// staff lines
	var linePoints = [-15,-13,-11,-9,-7,-3,-1,1,3,5];
	svg.selectAll("line")
		.data(linePoints)
		.enter()
		.append("line")
		.attr("x1",staffScaleX(-6))
		.attr("x2",staffScaleX(6))
		.attr("y1",function(d){return staffScaleY(d);})
		.attr("y2",function(d){return staffScaleY(d);})
		.attr("stroke-width",1.5)
		.attr("stroke", "black");

	// treble clef
	svg.selectAll("path#treble")
		.data([1])
		.enter()
		.append("path")
		.attr("d","M 0,0 C -130.35701,-7.5767 -263.44969,-89.3404 -343.04863,-183.1839 C -435.33479,-291.98908 -473.38281,-439.92007 -463.63674,-561.40333 C -435.00596,-918.35402 -46.83042,-1129.32842 96.86235,-1285.247162 C 193.04421,-1389.61315 213.2077,-1440.48998 234.69104,-1494.16639 C 276.28308,-1598.06655 282.98293,-1719.801 200.52502,-1728.88941 C 121.79839,-1737.56678 57.02864,-1613.75891 28.101,-1529.14535 C 2.08714,-1453.04021 -15.20366,-1376.68386 0.44757,-1261.987227 C 7.48081,-1210.45732 201.07763,227.9456 204.34306,250.2419 C 236.94716,473.0586 109.52219,565.258 -20.55625,581.6582 C -301.45202,617.0711 -391.58256,331.6174 -265.68753,223.205 C -168.76582,139.7332 -27.75847,211.3946 -35.37628,348.625 C -42.1218,470.1722 -161.30327,473.7528 -191.75629,470.976 C -145.00808,554.8177 207.42125,598.6202 153.3064,219.8254 C 145.70227,166.5965 -33.19324,-1185.123947 -37.57761,-1215.371446 C -70.39635,-1441.81443 -75.39726,-1621.05247 42.58309,-1830.21831 C 86.13894,-1907.43327 154.97337,-1957.2825 188.76489,-1950.7562 C 196.19089,-1949.32216 203.58951,-1946.59562 209.46271,-1940.53517 C 299.96318,-1847.28535 327.72621,-1640.49892 317.81117,-1521.71022 C 307.65863,-1400.08081 302.00007,-1274.167527 181.06029,-1127.33262 C 134.25728,-1070.50952 -8.5632,-945.33152 -90.45022,-873.41435 C -205.50766,-772.36859 -288.96117,-684.11511 -334.1155,-577.64828 C -384.85987,-457.99184 -393.45047,-307.3663 -278.83605,-173.7164 C -212.90626,-98.205 -103.51651,-44.6245 -11.45414,-43.4827 C 244.52846,-40.3041 319.28175,-166.4868 321.67031,-309.38493 C 325.60253,-544.68339 41.53723,-633.64476 -75.25111,-471.85737 C -142.96661,-378.04581 -113.20321,-279.30641 -67.72462,-232.3298 C -52.11449,-216.2082 -34.67752,-203.9274 -18.18139,-197.0814 C -12.20313,-194.6015 1.85878,-188.0615 -2.1328,-178.489 C -5.45303,-170.5241 -11.90171,-170.0765 -17.77492,-170.7798 C -91.423,-179.6125 -172.97206,-250.0089 -193.02593,-371.09478 C -222.24585,-547.57889 -66.50523,-756.932 155.80457,-722.6929 C 301.34699,-700.27787 436.47657,-575.04508 424.62507,-341.84744 C 414.46347,-141.9847 248.77123,14.4593 0,0 z")
		.attr("id","treble")
		.attr("transform",function(){return "translate(" + staffScaleX(-4) + "," + staffScaleY(-3) + ") scale(0.045)";});
	// bass clef
	svg.selectAll("path#bass")
		.data([1])
		.enter()
		.append("path")
		.attr("d","M 0,0 C 158,-107 276,-188 352,-244 C 428,-299 508,-368 590,-450 C 672,-532 741,-625 797,-728 C 841,-804 879,-892 910,-992 C 941,-1091 957,-1187 960,-1278 C 960,-1363 949,-1444 926,-1520 C 904,-1597 866,-1660 812,-1711 C 758,-1761 688,-1786 601,-1786 C 517,-1786 438,-1769 364,-1736 C 291,-1702 239,-1648 210,-1572 C 210,-1565 206,-1556 200,-1543 C 202,-1527 210,-1515 225,-1506 C 240,-1497 253,-1493 265,-1493 C 271,-1493 288,-1496 314,-1502 C 341,-1508 363,-1512 381,-1512 C 434,-1512 481,-1493 524,-1456 C 566,-1419 587,-1374 587,-1321 C 587,-1283 576,-1247 555,-1214 C 534,-1181 505,-1154 468,-1135 C 431,-1115 390,-1106 346,-1106 C 266,-1106 198,-1130 142,-1179 C 87,-1229 59,-1292 59,-1371 C 59,-1472 90,-1559 151,-1633 C 213,-1707 291,-1762 387,-1799 C 482,-1837 578,-1855 676,-1855 C 783,-1855 885,-1828 980,-1773 C 1076,-1719 1151,-1644 1207,-1551 C 1263,-1457 1292,-1357 1292,-1249 C 1292,-1057 1228,-879 1100,-714 C 972,-549 814,-406 625,-284 C 499,-201 295,-89 14,52 L 0,0 z M 1389,-1547 C 1389,-1583 1402,-1613 1428,-1637 C 1453,-1662 1484,-1674 1521,-1674 C 1553,-1674 1583,-1660 1610,-1633 C 1637,-1607 1650,-1576 1650,-1542 C 1650,-1506 1636,-1475 1610,-1450 C 1582,-1426 1551,-1414 1516,-1414 C 1479,-1414 1449,-1426 1425,-1453 C 1401,-1479 1389,-1510 1389,-1547 z M 1389,-1023 C 1389,-1059 1402,-1090 1426,-1114 C 1451,-1139 1482,-1151 1521,-1151 C 1553,-1151 1582,-1138 1610,-1111 C 1636,-1084 1650,-1055 1650,-1023 C 1650,-984 1637,-953 1612,-928 C 1586,-903 1556,-890 1521,-890 C 1482,-890 1451,-903 1426,-927 C 1402,-951 1389,-983 1389,-1023 z ")
		.attr("id","bass")
		.attr("transform",function(){return "translate(" + staffScaleX(-5.5) + "," + staffScaleY(-14) + ") scale(0.03)";})
}
function refreshGraph()
{
	// recalculate width
	w = leftSideOffset + numStrings*(fretHeight + fretPadding) + leftSide;
	// set width
	svg.attr("width", w);
	// recalculate x scale
	staffScaleX = d3.scale.linear()
		.domain([-6,6]) // not adaptive, will not change
		.range([w-160,w]);

	// neck body
	svg.selectAll("rect#neck")
		.data([1])
		.attr("y",heightOffset)
		.attr("x",leftSideOffset-fretPadding)
		.attr("height",h-heightOffset)
		.attr("width",fretHeight*numStrings + fretPadding)
		.style("fill","#6F5000");

	// head
	svg.selectAll("rect#head")
		.data([1])
		.attr("y",0)
		.attr("x",leftSideOffset-fretPadding-headSize)
		.attr("height",heightOffset + xScale(nutSize) - fretPadding)
		.attr("width",fretHeight*numStrings + fretPadding + (2*headSize))
		.style("fill","#4E3800");

	// fret metal
	svg.selectAll("rect#fretMetal")
		.data(instantiatedFretDecorations)
		.attr("y",function(d){return heightOffset + xScale(d.fretPosX) - fretPadding;})
		.attr("x",function(d){return (leftSideOffset - fretPadding);})
		.attr("height",function(d){return fretPadding;})
		.attr("width",(numStrings * fretHeight) + fretPadding)
		.style("fill",function(d)
			{
				if(d.fretIndex == 0)
				{
					return "#000";
				}
				else
				{
					return "#aaa";
				}
			});

	// fret decorations
	svg.selectAll("circle#fretDecoration")
		.data(instantiatedDots)
		.attr("cx",function(d){return leftSideOffset - (fretPadding/2) + (numStrings * fretHeight)/2 + (d.xCenterOffset * dotSpacing * dotSize);})
		.attr("cy",function(d){return heightOffset + xScale(d.fretPosX) - (fretPadding/2) + xScale(d.yCenterOffset);})
		.attr("r",dotSize)
		.attr("fill","white");

	// strings
	svg.selectAll("rect#strings")
		.data(instantiatedStrings)
		.attr("x",function(d){return leftSideOffset + (fretHeight*d.stringIndex) + (fretHeight/2) - (fretPadding);})
		.attr("y",0)
		.attr("height",h)
		.attr("width",function(d){return d.stringWidth;})
		.style("fill",function(d){return d.stringColor;});

	// frets
	svg.selectAll("rect#fret")
		.data(instantiatedFretBoard)
		.attr("y",function(d){return heightOffset + xScale(d.fretPosX);})
		.attr("x",function(d){return leftSideOffset + d.stringIndex * fretHeight;})
		.attr("height",function(d,i){return xScale(d.fretWidthX) - fretPadding;})
		.attr("width",fretHeight-fretPadding)
		//.attr("cy",function(d){return heightOffset + xScale(d.fretPosX) + (xScale(d.fretWidthX) - fretPadding)/2;})
		//.attr("cx",function(d){return leftSideOffset + d.stringIndex * fretHeight + (fretHeight-fretPadding)/2;})
		//.attr("r",circleSize)
		.style("fill", function(d)
			{
				if(d.activeFlag)
				{
					return "red";
				}
				else
				{
					return "white";
				}
			}
		)
		.style("opacity", function(d)
			{
				if(d.activeFlag)
				{
					return 1.0;
				}
				else
				{
					return fretOpacity;
				}
			}
		);

	// notes
	svg.selectAll("path#notes")
		.data(instantiatedFretBoard)
		.attr("d","m 0,10 c -5.49692,-1.69186 -9.83405,-6.28944 -9.83405,-10.4246 0,-11.704229 25.13958,-16.335904 35.52156,-6.544434 11.22686,10.588284 -7.09488,22.691526 -25.68751,16.969034 z m 16.76819,-2.9403 c 3.05854,-4.66792 0.13433,-13.916407 -5.16332,-16.330174 -7.77978,-3.544708 -12.54851,2.495846 -9.30827,11.790804 2.2412,6.42911 11.35935,9.289252 14.47159,4.53937 z")
		.attr("transform",function(d){return "translate(" + (staffScaleX(0 + d.xOffset + 1)) + "," + (staffScaleY(d.noteLine)) + ") scale(0.65)";})
		.style("fill","black")
		.transition().duration(transitionDuration)
		.style("opacity",function(d){return d.activeFlag * 1.0;});
	// sharps
	svg.selectAll("path#sharps")
		.data(instantiatedFretBoard)
		.attr("d","M 0,0 L 0,-4.704 L 2,-5.256 L 2,-0.576 L 0,0 z M 3.938,-1.138 L 2.563,-0.744 L 2.563,-5.424 L 3.938,-5.808 L 3.938,-7.752 L 2.563,-7.368 L 2.563,-12.14977 L 2,-12.14977 L 2,-7.223 L 0,-6.648 L 0,-11.29777 L -0.531,-11.29777 L -0.531,-6.471 L -1.906,-6.086 L -1.906,-4.138 L -0.531,-4.522 L -0.531,0.149 L -1.906,0.532 L -1.906,2.472 L -0.531,2.088 L -0.531,6.84277 L 0,6.84277 L 0,1.918 L 2,1.368 L 2,5.99377 L 2.563,5.99377 L 2.563,1.194 L 3.938,0.809 L 3.938,-1.138 z ")
		.attr("transform",function(d){return "translate(" + (staffScaleX(-1.5 + d.xOffset + 1)) + "," + (staffScaleY(d.noteLine - 0.75)) + ") scale(2.2)";})
		.style("fill","black")
		.transition().duration(transitionDuration)
		.attr("opacity",function(d){return d.activeFlag * d.sharp * 1.0;});
	// flats
	svg.selectAll("path#flats")
		.data(instantiatedFretBoard)
		.attr("d","M 0,0 C -0.626565,0.78306 -1.154,1.23125 -1.849,1.75825 L -1.849,-0.83628 C -1.691,-1.23528 -1.458,-1.55828 -1.149,-1.80628 C -0.841,-2.05328 -0.529,-2.17728 -0.213,-2.17728 C 1.262857,-1.96313 0.745999,-0.70866 0,0 z M -1.849,-2.11528 L -1.849,-9.38695 L -2.412,-9.38695 L -2.412,2.23025 C -2.412,2.58225 -2.316,2.75825 -2.124,2.75825 C -2.013,2.75825 -1.875087,2.66525 -1.669,2.54225 C -0.267092,1.67886 0.633494,0.97992 1.53283,-0.2533 C 1.81086,-0.63455 2.007461,-1.49916 1.60497,-2.10298 C 1.35397,-2.47954 0.875661,-2.87506 0.262641,-2.99198 C -0.530908,-3.14333 -1.21524,-2.74823 -1.849,-2.11528 z")
		.attr("transform",function(d){return "translate(" + (staffScaleX(-1.5 + d.xOffset + 1.25)) + "," + (staffScaleY(d.noteLine - 0.2)) + ") scale(3.2)";})
		.style("fill","black")
		.transition().duration(transitionDuration)
		.attr("opacity",function(d){return d.activeFlag * d.flat * 1.0;});
	// double sharps
	svg.selectAll("path#doubleSharps")
		.data(instantiatedFretBoard)
		.attr("transform",function(d){return "translate(" + (staffScaleX(-1.5 + d.xOffset + 1.75)) + "," + (staffScaleY(d.noteLine-0.925)) + ") scale(2.5)";})
		.attr("d","m 0,0 c -0.73457,-0.11529 -1.48131,-0.11512 -2.2232,-0.11427 -0.0157,-0.54283 0.0709,-1.12004 -0.1443,-1.62951 -0.14329,-0.33917 -0.41618,-0.60678 -0.65881,-0.88188 -0.38717,0.34625 -0.70518,0.8032 -0.73565,1.33483 -0.03,0.39129 -0.008,0.78447 -0.0148,1.17656 -0.7418,0.0112 -1.46115,-0.0313 -2.19297,0.11449 0.14112,-0.7277 0.0788,-1.46572 0.0916,-2.20263 0.56487,-0.0153 1.1694,0.0662 1.69401,-0.17954 0.30957,-0.14503 0.57169,-0.37231 0.83426,-0.5885 -0.3418,-0.38711 -0.78564,-0.72815 -1.32245,-0.76025 -0.40092,-0.0317 -0.80399,-0.009 -1.20582,-0.0155 -0.0252,-0.73148 0.0602,-1.47242 -0.0916,-2.19467 0.72346,0.13067 1.46144,0.0971 2.19299,0.10654 0.0109,0.52099 -0.0474,1.06097 0.0997,1.56266 0.11223,0.38288 0.41787,0.67743 0.67319,0.97971 0.36043,-0.3141 0.68547,-0.70815 0.74501,-1.20109 0.0539,-0.44619 0.0111,-0.89435 0.0357,-1.34128 0.73683,-0.0194 1.51,0.1266 2.2232,-0.10654 -0.10644,0.74311 -0.13011,1.44522 -0.12183,2.19467 -0.5259,0.0149 -1.07763,-0.0435 -1.57762,0.1336 -0.3798,0.13453 -0.67841,0.42884 -0.98086,0.68868 0.32792,0.33542 0.72291,0.64477 1.21161,0.69043 0.44804,0.0419 0.89799,0.0229 1.34687,0.0311 0.0111,0.73478 -0.0252,1.4777 0.12183,2.20241 z")
		.style("fill","black")
		.transition().duration(transitionDuration)
		.attr("opacity",function(d){return d.activeFlag * d.doubleSharp * 1.0;});
	// chord list
	answerDiv.html(calculatedChords)
		.style("left", (w - leftSide - 10) + "px")
		.style("top", (400) + "px")
		.style("text-align", "left")
		.style("max-width", (150) + "px");

	// move lines
	svg.selectAll("line")
		.attr("x1",staffScaleX(-6))
		.attr("x2",staffScaleX(6));
	// move treble clef
	svg.selectAll("path#treble")
		.attr("transform",function(){return "translate(" + staffScaleX(-4) + "," + staffScaleY(-3) + ") scale(0.045)";});
	// move bass clef
	svg.selectAll("path#bass")
		.attr("transform",function(){return "translate(" + staffScaleX(-5.5) + "," + staffScaleY(-14) + ") scale(0.03)";})
}
// fretboard creation
function createFretBoard(numFrets, numStrings, offsetsFromA4, nutSize)
{
	var L = 25.5;
	var k = Math.pow(2,(1/notesPerScale()));
	var noteLetters = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
	var fretBoard = new Array();
	var fretOrnaments = new Array();
	var strings = new Array();
	var dots = new Array();
	for(i = -1; i < numFrets; i++) // start at negative one to account for the nut
	{
		for(j = 0; j < numStrings; j++)
		{
			if(i == -1)
			{
				Bn = -nutSize;
				Bnp1 = 0;
				strings.push
				(
					{
						"stringIndex":j,
						"stringWidth":4,
						"stringColor":"#777", // JACKPOT
					}
				);
			}
			else
			{
				var Bn = L-(L/Math.pow(k,i));
				var Bnp1 = L-(L/Math.pow(k,(i+1)));
			}
			letterIndex = trueModulus(i + 1 + offsetsFromA4[j], notesPerScale());
			halfStepsAwayFromA4 = offsetsFromA4[j] + (i + 1);
			var lineAndAccidental = findNoteLineAndAccidental(halfStepsAwayFromA4, "sharp");
			fretBoard.push(
				{
					"stringIndex":j,
					"fretIndex":i,
					"fretPosX":(Bn+nutSize),
					"fretWidthX":(Bnp1-Bn),
					"noteLetter":noteLetters[letterIndex],
					"noteFrequency":noteFrequency(halfStepsAwayFromA4),
					"offsetFromA4":halfStepsAwayFromA4,
					"activeFlag":Boolean(0),
					"noteLine":lineAndAccidental.staffOffset,
					"sharp":lineAndAccidental.accidental,
					"flat":false,
					"doubleSharp":false,
					"doubleFlat":false,
					"xOffset":0,
				}
			);
		}
		if(i >= 0)
		{
			fretOrnaments.push(
				{
					"fretIndex":i,
					"fretPosX":Bn+nutSize,
				}
			);

			var numDots = circleMap[trueModulus(i,notesPerScale())];
			if(numDots > 0)
			{
				for(dotIndex = 0; dotIndex < numDots; dotIndex++)
				{
					dots.push
					(
						{
							"xCenterOffset":evenOrOdd(dotIndex) * (1 - numDots),
							"fretPosX":(Bn+nutSize),
							"yCenterOffset":(Bnp1-Bn)/2,
						}
					);
				}
			}
		}
	}
	
	return {'fretBoard': fretBoard, 'strings': strings, 'fretOrnaments': fretOrnaments, 'dots':dots,};
}
// convert numbered letter to a4 offset
function convertNumberedLetterToOffset(numberedLetter)
{
	var offsetLetter = noteLetterOffset[numberedLetter[0]];
	var octaveOffset = parseInt(numberedLetter[1], 10) - 4;
	return offsetLetter + (octaveOffset * notesPerScale());
}
// math music functions
function noteFrequency(halfStepsAwayFromA4)
{
	// equation from http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
	var answer = 440*Math.pow(2,(halfStepsAwayFromA4/notesPerScale()))
	return answer.toFixed(1);
}
function findNoteLineAndAccidental(halfStepsAwayFromA4, sharpOrFlat)
{
	// two ways to go down, either you have a positive step value or a negative one
	if(halfStepsAwayFromA4 >= 0)
	{
		// so depending on the number of half steps away you are from A4,
		// you can calculate what line (or space) the note is on.
		var mapList = [0,0,1,2,2,3,3,4,5,5,6,6];
		var accidentalList = [false,true,false,false,true,false,true,false,false,true,false,true];
		// for every octave away you are, add 7 lines and spaces
		var numOctaves = roundTowardZero(halfStepsAwayFromA4 / notesPerScale());
		// find the map number
		var mapNumber = trueModulus(halfStepsAwayFromA4,notesPerScale());
		//return the data
		var noteLine = (numOctaves*7) + (mapList[mapNumber]);
		var jsonData = {"staffOffset":noteLine,"accidental":accidentalList[mapNumber]};
		return jsonData;
	}
	else
	{
		var tempVal = Math.abs(halfStepsAwayFromA4) - 1;
		var mapList = [-1,-1,-2,-2,-3,-4,-4,-5,-5,-6,-7,-7];
		var accidentalList = [true,false,true,false,false,true,false,true,false,false,true,false];
		var numOctaves = -roundTowardZero(tempVal / notesPerScale());
		var mapNumber = trueModulus(tempVal, notesPerScale());
		var noteLine = (numOctaves*7) + (mapList[mapNumber]);
		var jsonData = {"staffOffset":noteLine,"accidental":accidentalList[mapNumber]};
		return jsonData;
	}
}
function findPossibleListOfChords(fretBoard)
{
	// derive selected indices
	var selectedNotes = new Array;
	var selectedNoteLetters = new Array;
	for(fretIndex = 0; fretIndex < fretBoard.length; fretIndex++)
	{
		if(fretBoard[fretIndex].activeFlag)
		{
			selectedNotes.push(fretBoard[fretIndex].offsetFromA4);
			selectedNoteLetters.push(fretBoard[fretIndex].noteLetter);
		}
	}
	// normalize and order
	var noteLetter = new Array;
	var allChords = new Array;
	// create a uniqued array of intervals starting on each individual note
	for(noteIndex = 0; noteIndex < selectedNotes.length; noteIndex++)
	{
		var thisChord = new Array;
		for(noteIndex2 = 0; noteIndex2 < selectedNotes.length; noteIndex2++)
		{
			if(selectedNotes[noteIndex2] == selectedNotes[noteIndex])
			{
				noteLetter[noteIndex] = selectedNoteLetters[noteIndex2];
			}
			thisChord.push(trueModulus(selectedNotes[noteIndex2] - selectedNotes[noteIndex], notesPerScale()));
		}
		thisChord = thisChord.unique();
		thisChord.sort(sortNumber);
		allChords[noteIndex] = thisChord;
	}
	// check every chord
	var matchingChords = new Array;
	var matchingNotes = new Array;
	for(chordIndex = 0; chordIndex < chords.length; chordIndex++)
	{
		for(chordIndex2 = 0; chordIndex2 < allChords.length; chordIndex2++)
		{
			var tempChord = chords[chordIndex].intervals.unique();
			tempChord.sort(sortNumber);
			if(tempChord.length == allChords[chordIndex2].length)
			{
				var equal = true;
				for(noteIndex = 0; noteIndex < allChords[chordIndex2].length; noteIndex++)
				{
					if(tempChord[noteIndex] != allChords[chordIndex2][noteIndex])
					{
						equal = false;
					}
				}
				if(equal)
				{
					matchingChords.push(chordIndex);
					matchingNotes.push(noteLetter[chordIndex2]);
				}
			}
		}
	}
	var finalAnswer = new Array;
	for(mcIdx = 0; mcIdx < matchingChords.length; mcIdx++)
	{
		finalAnswer.push(matchingNotes[mcIdx] + " " + chords[matchingChords[mcIdx]].name);
	}
	return finalAnswer.unique();
}