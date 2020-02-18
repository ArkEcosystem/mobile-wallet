import BigNumber from "bignumber.js";

// Avoid scientific notation
// https://github.com/MikeMcl/bignumber.js/blob/master/bignumber.d.ts#L97
export default BigNumber;
// tslint:disable
export const SafeBigNumber = BigNumber.clone({
	DECIMAL_PLACES: 8,
	EXPONENTIAL_AT: 1e9,
});
