export function almostEqual(a, b, epsilon) {
	return Math.abs(a - b) < epsilon;
}

export function toRadians(angle) {
	return angle * (Math.PI / 180);
}

export function slope(x, y, angle) {
	const left = Math.abs(y) / Math.abs(x);
	const right = Math.tan(toRadians(angle));

	if (almostEqual(left, right, Number.EPSILON)) {
		return 0;
	}

	return left > right ? 1 : -1;
}

export function arrivedTime(sec) {
	return new Date((new Date() / 1000 + 60 * sec) * 1000);
}

export  function ShowCountDown(arrivedTime) {
	let now = new Date();
	let endDate = arrivedTime;
	let leftTime = endDate.getTime() - now.getTime();
	let leftsecond = parseInt(leftTime / 1000, 0);
	let day1 = Math.floor(leftsecond / (60 * 60 * 24));
	let hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
	let minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
	let second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
	const result = ((hour >= 10 ? hour : '0' + hour) + ':' +
	(minute >= 10 ? minute : '0' + minute) +  ':' +
	(second >= 10 ? second : '0' + second));

	return result;
}