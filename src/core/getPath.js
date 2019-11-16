export default function(source, projectname){
	let modelsIndex = 'https://dawenximodel.github.io/sm1/assets/modelsIndex.json';
	let models = 'https://dawenximodel.github.io/sm1/assets/models.json';
	let imageUrl = 'https://dawenximodel.github.io/sm1/assets/models';
	switch (`${source}-${projectname}`) {
		case 'value':
			break;
		default:
			break;
	}

	return {
		modelsIndex,
		models,
		imageUrl
	};
}