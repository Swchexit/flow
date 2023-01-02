function fR(max, min = 0) {
	return min + parseInt((max - min + 1) * fxrand());
}
let points = [];
let pd_url = "http://localhost:5678";
let use_local = true;
//條越大會越亂，目前是random variable
let mult;
let flow_speed = 0.1;
let curr_flow_cnt;
//add some randomness to the color
let r1;
let r2;
let g1;
let g2;
let b1;
let b2;
let gr1;
let gr2;
let max;
let timer = 1;
let count_timer = 0;
const startPd = () => {
	if (use_local) {
		// 一定要把數字、變數名都包在雙引號("")裡面
		// let postData = { "bass_volume": "0.1" };
		// httpPost(pd_url, "json", postData);
		// postData = { "ambient_volume": "0.5" };
		// httpPost(pd_url, "json", postData);
		postData = { "start": "-1" }; // -1 表示後面的數字沒意義
		httpPost(pd_url, "json", postData);
		// postData = { "start": "-1" }; // -1 表示後面的數字沒意義
		// httpPost(pd_url, "json", postData);
		// postData = { "init": "-1" }; // -1 表示後面的數字沒意義
		// httpPost(pd_url, "json", postData);
	} else {
		Pd.start();
		Pd.send("bass_volume", [0.7]);
		Pd.send("ambient_volume", [1]);
		Pd.send("bpm", [180]);
		Pd.send("start", [1]);
		Pd.send("start", [1]);
		Pd.send("init", [1]);
	}
};
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(30);
	angleMode(DEGREES);
	noiseDetail(1);
}

function draw() {
	noStroke();
	if (frameCount * 3 <= points.length) {
		max = frameCount * 3;
	} else {
		max = points.length;
	}

	curr_flow_cnt = 0;
	for (let i = 0; i < max; i++) {
		let r = map(points[i].x, 0, width, r1, r2);
		let g = map(points[i].y, 0, height, g1, g2);
		let b = map(points[i].x, 0, width, b1, b2);
		fill(r, g, b);
		let angle = map(noise(points[i].x * mult, points[i].y * mult), 0, 0.5, 0, 360);
		points[i].add(cos(angle) * flow_speed, sin(angle) * flow_speed);
		//limit the flow field to a circle
		if (dist(width / 2, height / 2, points[i].x, points[i].y) < 300) {
			ellipse(points[i].x, points[i].y, 1);
			curr_flow_cnt++;
		}
		noStroke();
	}
	timer = (timer + 1) % 2;
    count_timer++;
	if(count_timer % 500 == 0)
	{
		// count_timer = 0;
		gr1 = -1 * gr1;
		gr2 = -1 * gr2;
	}
	if(count_timer % 220 == 0) {
		// let volume_ratio = curr_flow_cnt / 800;
		let tmp = count_timer % 500;
		tmp = Math.floor(tmp / 62.5);
		let postData = { "bass_volume": `${tmp}` };	//`${volume_ratio}`
		httpPost(pd_url, "json", postData);
	}
	if (timer == 0) {
		if (use_local) {
			r1 = (r1 - gr1/500) % 256;
			r2 = (r2 - gr2/500) % 256;
			g1 = (g1 + gr1/500) % 256;
			g2 = (g2 + gr2/500) % 256;
			//b1 = random(128);
			//b2 = random(128);
		}
		else {
			Pd.send("bass_volume", [Math.min(curr_flow_cnt / 1000, 1)]);
			Pd.send("ambient_volume", [Math.min(curr_flow_cnt / 1000, 1)]);
		}
	}
}
// click to save the canvas as png
let swi = 0;

function mousePressed() {
	background(30);
	if (swi === 0) {
		startPd();
		// startPd()
		swi = 1;
	}
	let density = 30 + random(15);
	let space = width / density;
	points = [];
	for (let x = 0; x < width; x += space) {
		for (let y = 0; y < height; y += space) {
			let p = createVector(x + random(-10, 10), y + random(-10, 10));
			points.push(p);
		}
	}
	shuffle(points, true);

	r1 = random(256);
	g1 = random(256);
	b1 = random(256);

	r2 = 255 - r1
	g2 = 255 - g1
	b2 = 255 - b1
	gr1 = r1-g1;
	gr2 = r2-g2;

	mult = random(0.002, 0.01);
}
