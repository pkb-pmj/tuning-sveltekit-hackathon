export interface TuningGuideData {
	name: string;
	description?: string;
	steps: {
		text: string;
		data: IntervalTreeJSON;
	}[];
}
