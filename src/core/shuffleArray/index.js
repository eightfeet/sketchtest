// 随机洗牌数组
const shuffleArray = (array) => {
	let currentIndex = array.length;
	let temporary;
	let toIndex;

	while (currentIndex) {
		toIndex = Math.floor(Math.random() * currentIndex--);
		temporary = array[currentIndex];
		array[currentIndex] = array[toIndex];
		array[toIndex] = temporary;
	}

	return array;
};

export default shuffleArray;