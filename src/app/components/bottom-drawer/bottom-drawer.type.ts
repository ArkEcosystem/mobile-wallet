export type BottomDrawerBreak = "top" | "middle" | "bottom";

export type BottomDrawerBreakpoints = {
	[x in BottomDrawerBreak]?: {
		enabled: boolean;
		offset: number;
	};
};
