const { combineRgb } = require('@companion-module/base')
const {
	DEFAULT_HIGH_COLOR,
	DEFAULT_LOW_COLOR,
	DEFAULT_MID_COLOR,
	getThresholdColor,
	normalizePercent,
	renderArcGauge,
} = require('./gauge')
const { ROTARY_COUNT } = require('./constants')

function gaugeOptions(targetLabel) {
	return [
		{
			type: 'number',
			label: targetLabel,
			id: 'target',
			default: 1,
			width: 64,
			min: 1,
			max: ROTARY_COUNT,
		},
		{
			type: 'number',
			label: 'Low threshold %',
			id: 'lowThreshold',
			default: 65,
			width: 6,
			min: 0,
			max: 100,
		},
		{
			type: 'number',
			label: 'High threshold %',
			id: 'highThreshold',
			default: 85,
			width: 6,
			min: 0,
			max: 100,
		},
		{
			type: 'colorpicker',
			label: 'Low color',
			id: 'lowColor',
			default: DEFAULT_LOW_COLOR,
			returnType: 'number',
			width: 4,
		},
		{
			type: 'colorpicker',
			label: 'Mid color',
			id: 'midColor',
			default: DEFAULT_MID_COLOR,
			returnType: 'number',
			width: 4,
		},
		{
			type: 'colorpicker',
			label: 'High color',
			id: 'highColor',
			default: DEFAULT_HIGH_COLOR,
			returnType: 'number',
			width: 4,
		},
		{
			type: 'checkbox',
			label: 'Invert direction',
			id: 'invert',
			default: false,
			width: 6,
		},
	]
}

function buildArcGaugeFeedback(value, feedback) {
	const width = feedback.image?.width ?? 72
	const height = feedback.image?.height ?? 72
	const normalizedValue = normalizePercent(value)
	const displayedValue = feedback.options.invert ? 1 - normalizedValue : normalizedValue
	const gaugeColor = getThresholdColor(displayedValue, feedback.options)

	return {
		color: gaugeColor,
		bgcolor: combineRgb(0, 0, 0),
		imageBuffer: renderArcGauge(normalizedValue, {
			...feedback.options,
			width,
			height,
		}),
		imageBufferEncoding: {
			pixelFormat: 'RGBA',
		},
		imageBufferPosition: {
			x: 0,
			y: 0,
			width,
			height,
		},
	}
}

exports.getFeedbacks = function (self) {
	var feedbacks = {
		GenericButton: {
			type: 'boolean',
			name: 'Generic Button State',
			description: 'Change colour depending on state of Generic Button',
			defaultStyle: {
				// Move the values from options to here
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 0, 255),
			},
			// remove the old style properties from options
			options: [
				{
					type: 'number',
					label: 'Button Number',
					id: 'buttonNr',
					default: 1,
					width: 64,
					min: 1,
					max: 24,
				},
			],
			callback: (feedback) => {
				return self.liveprofessorState.buttons[feedback.options.buttonNr] == 1
			},
		},
		TempoFlash: {
			type: 'boolean',
			name: 'Tempo Tap Flash',
			description: 'Change color when tempo is received',
			options: [],
			defaultStyle: {
				// Move the values from options to here
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 153, 0),
			},
			callback: (feedback) => {
				return self.liveprofessorState.tempoflash
			},
		},
		SnapshotRecalled: {
			type: 'boolean',
			name: 'Global Snapshot Recalled',
			description: 'Change color when a Snapshot matches. Use number or name depending on action',
			defaultStyle: {
				// Move the values from options to here
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(94, 194, 232),
			},
			options: [
				{
					label: 'Snapshot Number',
					type: 'number',
					id: 'snapshotnr',
					width: 64,
					default: 1,
					min: 1,
					max: 9999,
				},
			],
			callback: (feedback) => {
				return self.liveprofessorState.currentGlobalSnapshot.id == feedback.options.snapshotnr
			},
		},
		ViewSetRecalled: {
			type: 'boolean',
			name: 'View Set Recalled',
			description: 'Change color when view set matches number',
			defaultStyle: {
				// Move the values from options to here
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(94, 194, 232),
			},
			options: [
				{
					label: 'View Set Number',
					type: 'number',
					id: 'viewset',
					width: 64,
					default: 1,
					min: 1,
					max: 9999,
				},
			],
			callback: (feedback) => {
				return self.liveprofessorState.currentViewSetId == feedback.options.viewset
			},
		},
		QuickAssignMode: {
			type: 'boolean',
			name: 'Quick Assign Mode',
			description: 'Change color when Quick Assign is active',
			defaultStyle: {
				// Move the values from options to here
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(94, 194, 232),
			},
			options: [],
			callback: (feedback) => {
				return self.liveprofessorState.quickAssignMode
			},
		},
		RotaryArcGauge: {
			type: 'advanced',
			name: 'Rotary Arc Gauge',
			description: 'Draw an arc gauge using a rotary raw value',
			options: gaugeOptions('Rotary Number'),
			callback: (feedback) => {
				const target = Number(feedback.options.target)
				const value = target >= 1 && target <= ROTARY_COUNT ? self.liveprofessorState.rotaryValues[target - 1] : 0
				return buildArcGaugeFeedback(value, feedback)
			},
		},
		DspArcGauge: {
			type: 'advanced',
			name: 'DSP Arc Gauge',
			description: 'Draw an arc gauge using the LiveProfessor DSP meter',
			options: gaugeOptions('DSP Meter').filter((option) => option.id !== 'target'),
			subscribe: () => {
				self.subscribeDspMeter()
			},
			unsubscribe: () => {
				self.unsubscribeDspMeter()
			},
			callback: (feedback) => {
				return buildArcGaugeFeedback(self.liveprofessorState.dspMeter, feedback)
			},
		},
	}

	return feedbacks
}
