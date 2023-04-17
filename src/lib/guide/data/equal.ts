import type { TuningGuideData } from '../guide';
import { pythagorean } from './pythagorean';

export const equal: TuningGuideData = {
	name: 'Equal Temperament',
	steps: [
		{
			text: 'Start with the Pythagorean tuning - add the other 11 notes using only perfect fifths',
			data: pythagorean.steps[0].data,
		},
		{
			text: "Add one more note a fifth up from F, so it's almost equal to the original C",
			data: {
				'3/2': {
					'3/2': {
						'3/2': {
							'3/2': {
								'3/2': {
									'3/2': {
										'3/2': {
											'3/2': {
												'3/2': {
													'3/2': {
														'3/2': {
															'3/2': {},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
		{
			text: 'Select the resulting comma between the two different C notes, divide it by 12 and subtract from all fifths',
			data: {
				'1*2^7/12': {
					'1*2^7/12': {
						'1*2^7/12': {
							'1*2^7/12': {
								'1*2^7/12': {
									'1*2^7/12': {
										'1*2^7/12': {
											'1*2^7/12': {
												'1*2^7/12': {
													'1*2^7/12': {
														'1*2^7/12': {},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	],
};
