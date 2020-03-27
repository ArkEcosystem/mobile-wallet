export const removeLogs = () => {
	const ionicRootMsg =
		"Ionic Angular was already initialized. Make sure IonicModule.forRoot() is just called once.";
	const warnSpy = spyOn(console, "warn");
	warnSpy
		.withArgs(ionicRootMsg[0])
		.and.callFake(() => void 0)
		.and.stub();
};

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
