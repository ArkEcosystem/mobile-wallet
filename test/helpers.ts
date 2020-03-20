export const removeLogs = () => {
	spyOn(console, "warn")
		.withArgs(
			"Ionic Angular was already initialized. Make sure IonicModule.forRoot() is just called once.",
		)
		.and.callFake(() => void 0);
};

export const sleep = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms));
