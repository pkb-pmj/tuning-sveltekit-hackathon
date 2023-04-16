import type { IntervalTreeJSON } from '$lib/intervalTree';

export const data: { text: string; data: IntervalTreeJSON }[] = [
	{
		text: 'Add the other 11 notes using perfect fifths',
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
		text: 'Add the note E a major third from C',
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
];
