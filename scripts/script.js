//start at top
$(document).ready(function(){
    $(this).scrollTop(0);
});

//global variables
var last_known_scroll_position = 0;
var toggle = false,
	check = false;

var selection = d3.select(".line-drawing");
var textheight = 22,
	clr = ["#2F2F79", "#4A3D2F"],
	cl0 = clr[0], cl1 = clr[1],
	dur = 700,
	opac = .35,
	return_amt = 30,
	edge = 505,
	edge2 = 1010;


//
//---------THIS SECTION IS FOR THE CONTSTRUCTOR ANIMATION---------//
//


//create svg
selection;

//run code on svg every 30 seconds
function fnsec() {
		var hfd = how_far_down();
		if (!check){
			if (hfd > 860 && hfd < 1160) {
				instruction('click to animate', 20)
			} else if (hfd > 1760 && hfd < 2390 || hfd > 2990 && hfd < 3242 || hfd > 4142 && hfd < 4360) {
				instruction('click to see analysis of user', 38)
			} else {
				instruction();
			}
		}

		if (check) {
			if (hfd < 860 || hfd > 1160 && hfd < 1760 || hfd > 2390 && hfd < 2990 || hfd > 3242 && hfd < 4142 || hfd > 4360) {
				instruction()
			} 
		}
}

fnsec();
setInterval(fnsec, .5*1000);

function instruction(message, num) {

	if (message) {
		d3.select('#floater')
			.append('text')
			.attr('class', 'instruction')
				.text(message)
				.style('height', num)
				.attr('fill', '#000')
				.style('opacity', 0)
					.transition()
					.duration(500)
					.style('opacity', 1)

		check = true;
	};

	if (!message) {

		d3.select('#floater').selectAll('text')
			.transition()
			.duration(600)
			.style('opacity', 0)
			.remove();

		check = false;

	};
}

//calculate how far down page user is
function how_far_down() { var scrollTop = $(window).scrollTop();
    						return scrollTop; }


queue()
	.defer(d3.csv, "../data/PeeJayOhtweets.csv", parse) 
	.defer(d3.csv, "../data/door_mouse_bottweets.csv", parse)
	.await(tweet_loaded);
	d3.csv



//
//
//
//
//---------------- ON CLICK CONTOLS ----------------------------------------------------------------------//
//
//
//
//




function tweet_loaded(err, pjo, bot) {
	//console.log(pjo);
	// console.log(bot);

	var holder = run_it(pjo, bot);

	d3.select('#pjo_pic')
		.on('click', function() { draw_charts(holder[0], clr, cl0, true, holder[2]) })

	d3.select('#bot_pic')
		.on('click', function() { draw_charts(holder[1], clr, cl1, true, holder[3]) })

};





//
//
//
//
//----------------WHERE ON THE PAGE CONTOLS--------------------------------------------------------//
//
//
//
//


function draw_charts(array, clr, cl, t, ar) {

	//incoming message to clear and redraw
	if (t) { d3.select('.bar_chart').select('svg').remove() }

	var hfd = how_far_down();

	if (hfd > 640 && hfd < 1460) {
		//RUN CONNECTOR ANIMATION
		draw_connect_all(clr[0],clr[1]);

	} else if (hfd > 1490 && hfd < 2840) {
		//DRAW BAR CHART
		draw_bar_chart(array, cl)

	} else if (hfd > 2840 && hfd < 3842) {
		//SHOW BOXPLOT AND RHYTHM LINE
		draw_rhythm(ar, cl)
		draw_box_plot(ar, cl)

	} else if (hfd > 3982 && hfd < 4860) {
		//SHOW HISTOGRAM
		draw_histogram(ar, cl)

	} else { 
		d3.selectAll('.box').selectAll('svg').remove()
		d3.selectAll('.bar_chart').selectAll('svg').remove();
	}
	
	t = false;

	
}


//
//--------------FUNCTIONS TO RUN ON VARIOUS PLOTS----------------------//
//

function draw_histogram(ar, cl){

	console.log(ar);

	var x = [];

	for (var i = 0; i < ar.length; i ++) {
		x[i] = ar[i].stamp;
	}

	console.log(x);

	var data = [
	  {
	    x: x,
	    marker: {
	    	color: cl },
	    type: 'histogram'
	  }
	];


	Plotly.newPlot('histog', data);

	// console.log(ar);
	// // A formatter for counts.
	// var formatCount = d3.format(",.0f");

	// var margin = {top: 10, right: 30, bottom: 30, left: 30},
	// 	width = document.getElementById('histog').clientWidth-margin.left-margin.right,
	//     height = 950 - margin.top - margin.bottom;

	// var maxD = new Date(2017,4,21,221,23),
	// 	minD = new Date(2013,8,4,4,38);

	// var x = d3.time.scale()
	//     .domain([minD,maxD])
	//     .range([0, width]);

	// var get_data = function () {
	// 	return ar.stamp;
	// }

	// // Generate a histogram using twenty uniformly-spaced bins.
	// var data = d3.layout.histogram()
	//     .bins(x.ticks(100))
	//     .value(get_data());

	// console.log(data);

	// var y = d3.scale.linear()
	//     .domain([0, d3.max(data, function(d) { console.log(d); return d.y; })])
	//     .range([height, 0]);

	// var xAxis = d3.svg.axis()
	//     .scale(x)
	//     .orient("bottom");

	// var svg = d3.select("#histog").append("svg")
	//     .attr("width", width + margin.left + margin.right)
	//     .attr("height", height + margin.top + margin.bottom-350)
	//   .append("g")
	//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// var bar = svg.selectAll(".bar")
	//     .data(data)
	//   .enter().append("g")
	//     .attr("class", "bar")
	//     .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	// bar.append("rect")
	//     .attr("x", 1)
	//     .attr("width", x(data[0].dx) - 1)
	//     .attr("height", function(d) { return height - y(d.y); });

	// bar.append("text")
	//     .attr("dy", ".75em")
	//     .attr("y", 6)
	//     .attr("x", x(data[0].dx) / 2)
	//     .attr("text-anchor", "middle")
	//     .text(function(d) { return formatCount(d.y); });

	// svg.append("g")
	//     .attr("class", "x axis")
	//     .attr("transform", "translate(0," + height + ")")
 //    .call(xAxis);

}



function draw_box_plot(ar, cl) {

	//console.log(ar);

	var arr = [];

	ar.forEach( function(e){
		var g = e.characters_used;
		arr = arr.concat(g)
	})

	//console.log(arr);

	var data = [
	  {
	    x: arr,
	    marker: { color: cl },
	    boxpoints: 'none',
	    
	    type: 'box'
	  }
	];

	var layout = {
		title: '',
		showlegend:false
	};

	Plotly.newPlot('myDiv', data, layout, {displayModeBar: false, scrollZoom: false});


}


function draw_rhythm (ar, cl) {

	var m = {t:15, b:15, l:15, r:15};
	var w = document.getElementById('rhythem').clientWidth-m.l-m.r,
		heig = 60;

	//console.log(ar);

	var scaleX = d3.scale.linear().domain([1,140]).range([28,w-209]),
		axis_loc = 165;
	var scaleY = d3.scale.linear().range([0,200])

	var make_it = d3.selectAll('.box')
					.append('svg')
						.attr('height', 330)
						.attr('width', w)
						.style('padding', m.t)
						
						
	var make_it2 = make_it.append('g')
						

	var nest = d3.nest()
			.key( function(e) { 
				if(e.characters_used > 140) {return 140 };
				return e.characters_used;
			}).entries(ar)

	//console.log(nest);
	var maxed = Math.max.apply(Math, nest.map( function(o){ return +o.values.length;} ) );
	var mined = Math.min.apply(Math, nest.map( function(o){ return +o.values.length;} ) );
	//console.log(maxed)
	//console.log(mined);
	scaleY.domain([mined,maxed]);

	var plot_rhy = d3.select('#rhythem').select('svg').select('g').selectAll('rect')
						.data(nest)  


	plot_rhy.attr("class", "update_it")
			.transition()
			.duration(500)
				.attr('y', function(e) { return 165 - (scaleY(e.values.length))*.5 })
				.attr('height', function(e) { return (scaleY( e.values.length )) })
				.style('fill', cl)

	plot_rhy.enter()
			.append('rect')
				.attr('x', function(e) { return scaleX(+e.key) })
				.attr('y', axis_loc)
				.attr('width', 10)
				.attr('height', 0)
				.style('fill', cl)
				.style('opacity', 1)
					.transition()
					.duration(500)
					.attr('y', function(e) { return 165 - (scaleY(e.values.length))*.5 })
					.attr('height', function(e) { return (scaleY( e.values.length )) })

	plot_rhy.exit()
			.transition()
			.duration(500)
				.style('opacity', 0)
				.remove() 

}


function draw_bar_chart (arrray, c) {

	var m = {t:15, b:15, l:15, r:15};
	var w = document.getElementById('graphic').clientWidth-m.l-m.r;

	var scaleX = d3.scale.linear().domain([0,arrray[0].value]).range([0,w])
	var plot = d3.select(".bar_chart")
		.append('svg')
		.attr('height', 800)
		.attr('width', w)
		.style('padding', m.t)
		.append('g')

	var bind = plot.selectAll('rect')
		.data(arrray)
		.enter()
		.append('rect')

	var bind_it = bind.attr('class', 'bars')
						.attr('x', 0)
						.attr('y', function(d,i) { return i*26 })
						.attr('height', 23)
						.attr('width', function(d) { return scaleX(d.value) })
						.attr('fill', c)

	var bind_t = plot.selectAll('.text-desc')
					.data(arrray)
					.enter()
					.append('text')
					.attr('class', 'text-desc')
	
	var bind_text = bind_t.attr('x', function(d,i) { 
									if (i == 0) { return scaleX(d.value)-48}
									else { return scaleX(d.value) + 5 }
									})
							.attr('y', function(d,i) { return i*26+17 } )
							.text( function(d) { return d.key+": "+d.value })
							.attr('font-family', 'Oswald')
							.attr('font-size', '14px')
							.attr('font-weight', 400)
							.attr('fill', function(d,i){ 
								if (i == 0) { return '#ddd'}
								else { return '#999' }
								})


}


//
//----RUNS FREQUENCY COUNTERS--------//
//

function run_it(pjo, bot) {

	//console.log(pjo)
	analytics(pjo);
	//console.log("@PeeJayOh:")
	
	analytics(bot)
	//console.log("@door_mouse_bot:")
	//console.log(bot)
	//console.log(pjo);

	var pjo_freq = word_freq_counter(pjo, return_amt);
	var bot_freq = word_freq_counter(bot, return_amt);

	return [pjo_freq, bot_freq, pjo, bot];

}

function analytics(stream) {

	var sent_bin = [];
	var word_bin = [];
	var wordL_bin = [];
	var char_bin = [];

	stream.forEach( function(d){
		//console.log(d)

		//characters in each tweet
		d.characters_used = d.tweet.length;
		char_bin = char_bin.concat(d.characters_used);

		//words in each tweet
		d.word_split = d.tweet.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").split(' ');
		var splitted2 = d.tweet.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g,"").replace(/\s{2,}/g," ").split(' ');
		var splitted3 = d.tweet.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'?@]/g,"").replace(/\s{2,}/g," ").split(' ');
		var bin = [];
		for (var i = 0; i < splitted2.length; i++) {
			//console.log("it ran");
			var word_length = splitted2[i].length;
			bin = bin.concat(word_length);
		}
		wordL_bin = wordL_bin.concat(bin);

		var sum = bin.reduce(function(previousValue, currentValue, currentIndex, array) {
		  return (previousValue + currentValue);
		});
		d.avg_word_length = sum/bin.length;

		//sentences in each tweet
		d.sent_split = d.tweet.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
		sent_bin = sent_bin.concat(d.sent_split.length);
		
		//word bin total
		word_bin = word_bin.concat(splitted3);
	})

	//avg amount of sentences used
	stream.avg_amt_sent_per_tweet = sent_bin.reduce(function(previousValue, currentValue, currentIndex, array) {
		  return (previousValue + currentValue);
		})/sent_bin.length;

	//avg words used in a tweet
	stream.avg_amt_words_per_tweet = word_bin.length/stream.length;
	//avg word length used in a tweet
	stream.avg_leng_word_in_tweet = wordL_bin.reduce(function(previousValue, currentValue, currentIndex, array) {
		  return (previousValue + currentValue);
		})/wordL_bin.length;
	//every word
	stream.every_word = word_bin;

	//avg length of tweet
	stream.avg_char_utilized_per_tweet = char_bin.reduce(function(previousValue, currentValue, currentIndex, array) {
		  return (previousValue + currentValue);
		})/stream.length;

	// console.log(char_bin);
	//console.log(stream);

	}

function word_freq_counter(array, num) {
	var every_word = array.every_word;
	var counts = [];

	for(var i = 0; i< every_word.length; i++) {
	    var word = every_word[i];
	    counts[word] = counts[word] ? counts[word]+1 : 1;
	}

	//console.log(counts);
	
	function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    return arr;
	}

	var arr = sortObject(counts);
	var arrr = arr.slice(0, num);
	return arrr; 
}


//
// ----------------- PARSING -----------------------//
//


function parse(d) {
	//console.log(d);
	
	return {
		date: d.date,
		time: d.time,
		tweet: d.tweet,
		stamp: parseDate(d.date, d.time),
		stamp2: parseD(d.date, d.time)
	}
}


function parseDate(da,ti){
	// console.log(da+', '+ti);

    var day1 = da.split(' ')[0].split('/'),
        time1 = ti.split(':')

    // console.log(day1);
    // console.log(time1);

    return new Date(+day1[2],+day1[1]-1, +day1[0], +time1[0], +time1[1]);
}

function parseD(da,ti){
	// console.log(da+', '+ti);

    var day1 = da.split(' ')[0].split('/'),
        time1 = ti.split(':')

    // console.log(day1);
    // console.log(time1);

    return (day1[2]+"-"+day1[1]-1+"-"+day1[0]+" "+time1[0]+":"+time1[1]);
}


//
//----------SVG DRAW FUNCTIONS----------------//
//


function draw_connect_all (clr1,clr2) {
	draw_connect_1(clr1);
	draw_connect_2(clr2);
	draw_connect_3();
	quit_draw();
}

function draw_connect_1 (c) {

	selection.append('rect')
		.attr('x', 18)
		.attr('y', 114)
		.attr('width', 112)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.duration(dur)
			.style('opacity', opac)

	selection.append('rect')
		.attr('x', 358)
		.attr('y', 335)
		.attr('width', 122)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*3)
			.duration(dur)
			.style('opacity', opac)

	selection.append('rect')
		.attr('x', 19)
		.attr('y', 335+textheight)
		.attr('width', 125)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*3)
			.duration(dur)
			.style('opacity', opac)

	selection.append('rect')
		.attr('x', 81)
		.attr('y', 555)
		.attr('width', 274)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*6)
			.duration(dur)
			.style('opacity', opac)
}

function draw_connect_2 (c) {
	
	selection.append('rect')
		.attr('x', 1152)
		.attr('y', 335)
		.attr('width', 219)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*5-250)
			.duration(dur)
			.style('opacity', opac)	

	selection.append('rect')
		.attr('x', 1038)
		.attr('y', 335)
		.attr('width', 112)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*2-250)
			.duration(dur)
			.style('opacity', opac)

	selection.append('rect')
		.attr('x', 1374)
		.attr('y', 335)
		.attr('width', 121)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*8-250)
			.duration(dur)
			.style('opacity', opac)

	selection.append('rect')
		.attr('x', 1038)
		.attr('y', 335+textheight)
		.attr('width', 155)
		.attr('height', textheight)
		.attr('stroke', 'none')
		.attr('stroke-width', 0)
		.style('fill', c)
			.style('opacity', 0)
			.transition()
			.delay(dur*8-250)
			.duration(dur)
			.style('opacity', opac)  	
}

function draw_connect_3 () {

	selection.append('line')
		.attr('x1', edge)
		.attr('y1', 114+(textheight/2))
	    .attr('x2', edge)
		.attr('y2', 114+(textheight/2))
	    .attr("stroke-width", 2)
	    .attr("stroke", '#999')
	    	.transition()
	    	.delay(dur)
	    	.duration(dur)
	    	.attr('x2', edge2)
			.attr('y2', 335+(textheight/2))

		selection.append('line')
		.attr('x1', edge)
		.attr('y1', 555+textheight*.5)
	    .attr('x2', edge)
		.attr('y2', 555+textheight*.5)
	    .attr("stroke-width", 2)
	    .attr("stroke", "#999")
	    	.transition()
	    	.delay(dur*7)
	    	.duration(dur)
	    	.attr('x2', edge2)
			.attr('y2', 335+textheight*1.5)
	
	selection.append('line')
		.attr('x1', edge)
		.attr('y1', 335+textheight)
	    .attr('x2', edge)
		.attr('y2', 335+textheight)
	    .attr("stroke-width", 2)
	    .attr("stroke", "#999")
	    	.transition()
	    	.delay(dur*4)
	    	.duration(dur)
	    	.attr('x2', edge2)
			.attr('y2', 335+textheight)
	    	
}

function quit_draw() {
	
	d3.selectAll(".line-drawing > *")
			.transition()
			.delay(dur*12)
			.duration(dur*2)
			.style('opacity', 0)
			.remove()
	
	d3.select(".line-drawing")
}