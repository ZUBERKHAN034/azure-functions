const generateAvatars = (name, gender) => {
	const uniqueName = `${name}-${Date.now()}`;

	const male = `https://api.dicebear.com/6.x/avataaars/svg?seed=${uniqueName}&accessories=kurt,prescription01,prescription02,round,sunglasses,wayfarers&accessoriesProbability=30&clothing=blazerAndShirt,collarAndSweater,hoodie,shirtCrewNeck,shirtVNeck,graphicShirt,blazerAndSweater&eyebrows=angryNatural,default,defaultNatural,flatNatural,frownNatural,raisedExcited,raisedExcitedNatural,sadConcerned,sadConcernedNatural,upDown,upDownNatural,angry&facialHairColor=2c1b18,4a312c,transparent&hairColor=2c1b18,4a312c,724133,a55728,b58143,c93305,d6b370,f59797,ecdcbf,e8e1e1,transparent&skinColor=614335,d08b5b,edb98a,ffdbb4,ae5d29,f8d25c,fd9841&top=dreads01,dreads02,frizzle,hat,shaggy,shortCurly,shortFlat,shortRound,shortWaved,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,ff6d60,1dbf73,a020f0`;
	const female = `https://api.dicebear.com/6.x/avataaars/svg?seed=${uniqueName}&facialHairProbability=0&top%5B%5D=bigHair,bob,bun,curly,curvy,dreads,frida,fro,hijab,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,straightAndStrand,straight01,straight02&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,ff6d60,1dbf73,a020f0`;

	const avatarUrl = gender === 'male' ? male : female;
	return avatarUrl;
};

module.exports = async (context, req) => {
	context.log('JavaScript HTTP trigger function processed a request.');

	const { name, gender } = req.body;

	if (name == null) {
		const errorMessage = `name must be specified in the request body`;
		return (context.res = {
			status: 400,
			body: errorMessage,
		});
	}

	if (gender == null) {
		const errorMessage = `gender must be specified in the request body`;
		return (context.res = {
			status: 400,
			body: errorMessage,
		});
	}

	if (gender !== 'male' && gender !== 'female') {
		const errorMessage = `gender must be male or female`;
		return (context.res = {
			status: 400,
			body: errorMessage,
		});
	}

	const avatarUrl = generateAvatars(name, gender);
	const responseMessage = avatarUrl;

	context.res = {
		status: 200 /* Defaults to 200 */,
		body: responseMessage,
	};
};
