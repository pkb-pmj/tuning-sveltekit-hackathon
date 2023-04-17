import type { TuningGuideData } from '../guide';
import { pythagorean } from './pythagorean';

export const meantone: TuningGuideData = {
	name: '1/4 Comma Meantone',
	steps: [
		{
			text: 'Start with the Pythagorean tuning - add the other 11 notes using only perfect fifths',
			data: pythagorean.steps[0].data,
		},
		{
			text: 'Add the note E a major third up from C',
			data: {
				'5/4': {},
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
		{
			text: 'Select the resulting comma between the two different E notes, divide it by 4 and subtract from all fifths',
			data: {
				'5/4': {},
				'1*5^1/4': {
					'1*5^1/4': {
						'1*5^1/4': {
							'1*5^1/4': {
								'1*5^1/4': {
									'1*5^1/4': {
										'1*5^1/4': {
											'1*5^1/4': {
												'1*5^1/4': {
													'1*5^1/4': {
														'1*5^1/4': {},
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
			text: 'Delete the now redundant perfect third E',
			data: {
				'1*5^1/4': {
					'1*5^1/4': {
						'1*5^1/4': {
							'1*5^1/4': {
								'1*5^1/4': {
									'1*5^1/4': {
										'1*5^1/4': {
											'1*5^1/4': {
												'1*5^1/4': {
													'1*5^1/4': {
														'1*5^1/4': {},
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
