exports.getActions = function (self) {
	const GenericCommands = [
		{ label: 'General - MIDI Panic', id: '/Command/General/MIDIPanic' },
		{ label: 'Project - New Project', id: '/Command/Project/NewProject' },
		{ label: 'Project - Open Project', id: '/Command/Project/OpenProject' },
		{ label: 'Project - Save Project', id: '/Command/Project/SaveProject' },
		{ label: 'Project - Save As', id: '/Command/Project/SaveAs' },
		{ label: 'Project - Save Project As Template', id: '/Command/Project/SaveAsTemplate' },
		{ label: 'Project - Close Project', id: '/Command/Project/CloseProject' },
		{ label: 'Project - Rename Project', id: '/Command/Project/RenameProject' },
		{ label: 'Options - Plugin Manager', id: '/Command/Options/PluginManager' },
		{ label: 'Options - Audio & Midi Options', id: '/Command/Options/Audio&MidiOptions' },
		{ label: 'Options - Program Options', id: '/Command/Options/ProgramOptions' },
		{ label: 'Options - Project Options', id: '/Command/Options/ProjectOptions' },
		{ label: 'Options - Keyboard Shortcuts', id: '/Command/Options/KeyboardShortcuts' },
		{ label: 'View - Audio Routing Panel', id: '/Command/View/PluginAudioRouting' },
		{ label: 'View - Midi Panel', id: '/Command/View/PluginMidiPanel' },
		{ label: 'View - Plugin Snapshot Panel', id: '/Command/View/PluginSnapshotPanel' },
		{ label: 'View - Plugin Preset Panel', id: '/Command/View/PluginPresetList' },
		{ label: 'View - Cue Lists Panel', id: '/Command/View/CueListPanel' },
		{ label: 'View - Global Snapshots Panel', id: '/Command/View/GlobalSnapshotsPanel' },
		{ label: 'View - Transport Panel', id: '/Command/View/TransportPanel' },
		{ label: 'View - Workspace Panel', id: '/Command/View/WorkspacePanel' },
		{ label: 'View - Full Screen', id: '/Command/View/FullScreen' },
		{ label: 'Transport & Tempo - Tap Tempo', id: '/Command/Transport&Tempo/TempoTap' },
		{ label: 'Transport & Tempo - Midi Clock Sync On/Off', id: '/Command/Transport&Tempo/MidiClockSyncOnOff' },
		{ label: 'Transport & Tempo - Return To Zero', id: '/Command/Transport&Tempo/ReturnToZero' },
		{ label: 'Transport & Tempo - Start/Stop Transport', id: '/Command/Transport&Tempo/StartStopTransport' },
		{ label: 'ViewModes - Chains', id: '/Command/ViewModes/Chains' },
		{ label: 'ViewModes - Live Cue List', id: '/Command/ViewModes/LiveCueList' },
		{ label: 'ViewModes - Patch View', id: '/Command/ViewModes/PatchView' },
		{ label: 'ViewModes - Wire View', id: '/Command/ViewModes/WireView' },
		{ label: 'ViewModes - Zoom In Wire View', id: '/Command/ViewModes/ZoomInWireView' },
		{ label: 'ViewModes - Zoom Out Wire View', id: '/Command/ViewModes/ZoomOutWireView' },
		{ label: 'Chains - Add New Chain', id: '/Command/Chains/AddNewChain' },
		{ label: 'Global Snapshots - Add New Global Snapshot', id: '/Command/GlobalSnapshots/AddNewGlobalSnapshot' },
		{
			label: 'Global Snapshots - Update Active Global Snapshot',
			id: '/Command/GlobalSnapshots/UpdateActiveGlobalSnapshot',
		},
		{ label: 'Global Snapshots - Recall Next Snapshot', id: '/Command/GlobalSnapshots/RecallNextGlobalSnapshot' },
		{
			label: 'Global Snapshots - Recall Previous Snapshot',
			id: '/Command/GlobalSnapshots/RecallPreviousGlobalSnapshot',
		},
		{ label: 'Controllers - Hardware Controllers Setup', id: '/Command/Controllers/HardwareControllersSetup' },
		{ label: 'Controllers - Map Controllers', id: '/Command/Controllers/MapControllers' },
		{ label: 'Controllers - Quick Assign', id: '/Command/Controllers/QuickAssign' },
		{ label: 'Selected Plugin - Enable Processing', id: '/Command/SelectedPlugin/EnableProcessingonselectedplugin' },
		{ label: 'Selected Plugin - Bypass', id: '/Command/SelectedPlugin/EnableBypassonselectedplugin' },
		{ label: 'Selected Plugin - Audio Mute', id: '/Command/SelectedPlugin/EnableAudioMuteonselectedplugin' },
		{ label: 'Selected Plugin - MIDI Mute', id: '/Command/SelectedPlugin/EnableMIDIMuteonselectedplugin' },
		{ label: 'Selected Plugin - ISO-Mode', id: '/Command/SelectedPlugin/EnableISO-Modeonselectedplugin' },
		{ label: 'Selected Plugin - Update Active Snapshot', id: '/Command/SelectedPlugin/UpdateActiveSnapshot' },
		{ label: 'Selected Plugin - Create New PluginSnapshot', id: '/Command/SelectedPlugin/CreateNewPluginSnapshot' },
		{ label: 'Selected Plugin - Rename Active Snapshot', id: '/Command/SelectedPlugin/RenameActiveSnapshot' },
		{ label: 'Selected Plugin - Duplicate Selected Plugin', id: '/Command/SelectedPlugin/Duplicateselectedplugin' },
		{ label: 'Selected Plugin - Remove Selected Plugin', id: '/Command/SelectedPlugin/Removeselectedplugin' },
		{ label: 'Plugin Windows - Show/Hide Selected Plugin', id: '/Command/PluginWindows/ShowHideselectedplugin' },
		{ label: 'Plugin Windows - TogglePluginWindows', id: '/Command/PluginWindows/TogglePluginWindows' },
		{ label: 'Plugin Windows - Send All To Back', id: '/Command/PluginWindows/Sendalltoback' },
		{ label: 'Plugin Windows - Send All To Front', id: '/Command/PluginWindows/Sendalltofront' },
		{ label: 'Plugin Windows - Select Next Chain', id: '/Command/PluginWindows/SelectNextChain' },
		{ label: 'Plugin Windows - Select Previous Chain', id: '/Command/PluginWindows/SelectPreviousChain' },
		{ label: 'Plugin Windows - Select Next Plugin', id: '/Command/PluginWindows/SelectNextPlugin' },
		{ label: 'Plugin Windows - Select Previous Plugin', id: '/Command/PluginWindows/SelectPreviousPlugin' },
	]

	let actions = {}

	actions['GenericRotaryRight'] = {
		name: 'Generic Rotary Control-Rotate Right',
		options: [
			{
				label: 'Rotary Nr',
				type: 'number',
				id: 'rotaryId',
				width: 64,
				default: 1,
				min: 1,
				max: 99,
			},
		],
		callback: async (event) => {
			const id = Number(await self.parseVariablesInString(event.options.rotaryId))
			const path = '/Companion/Rotary' + id

			let incValue = 0.03
			if (self.liveprofessorState.rotaryPush[id - 1]) incValue = 0.005

			self.liveprofessorState.rotaryValues[id - 1] += incValue
			if (self.liveprofessorState.rotaryValues[id - 1] > 1) self.liveprofessorState.rotaryValues[id - 1] = 1
			const val = self.liveprofessorState.rotaryValues[id - 1]
			self.sendOscMessage(path, [
				{
					type: 'f',
					value: val,
				},
			])
		},
	}
	actions['GenericRotaryLeft'] = {
		name: 'Generic Rotary Control-Rotate Left',
		options: [
			{
				label: 'Rotary Nr',
				type: 'number',
				id: 'rotaryId',
				width: 64,
				default: 1,
				min: 1,
				max: 99,
			},
		],
		callback: async (event) => {
			const id = Number(await self.parseVariablesInString(event.options.rotaryId))
			const path = '/Companion/Rotary' + id

			//Increase precision when rotary is pushed in
			let stepValue = 0.03
			if (self.liveprofessorState.rotaryPush[id - 1]) stepValue = 0.005

			self.liveprofessorState.rotaryValues[id - 1] -= stepValue
			if (self.liveprofessorState.rotaryValues[id - 1] < 0) self.liveprofessorState.rotaryValues[id - 1] = 0
			const val = self.liveprofessorState.rotaryValues[id - 1]

			self.sendOscMessage(path, [
				{
					type: 'f',
					value: val,
				},
			])
		},
	}
	actions['GenericRotaryPress'] = {
		name: 'Generic Rotary Control-Press',
		options: [
			{
				label: 'Rotary Nr',
				type: 'number',
				id: 'rotaryId',
				width: 64,
				default: 1,
				min: 1,
				max: 99,
			},
		],
		callback: async (event) => {
			const id = Number(await self.parseVariablesInString(event.options.rotaryId))
			const path = '/Companion/RotaryButton' + id + '/Press'

			//This will increase precision of the rotaries when held down.
			self.liveprofessorState.rotaryPush[id - 1] = true

			const val = 1
			self.sendOscMessage(path, [
				{
					type: 'f',
					value: val,
				},
			])
		},
	}
	actions['GenericRotaryRelease'] = {
		name: 'Generic Rotary Control-Release',
		options: [
			{
				label: 'Rotary Nr',
				type: 'number',
				id: 'rotaryId',
				width: 64,
				default: 1,
				min: 1,
				max: 99,
			},
		],
		callback: async (event) => {
			const id = Number(await self.parseVariablesInString(event.options.rotaryId))
			const path = '/Companion/RotaryButton' + id + '/Press'

			//This will increase precision of the rotaries when held down.
			self.liveprofessorState.rotaryPush[id - 1] = false

			const val = 0
			self.sendOscMessage(path, [
				{
					type: 'f',
					value: val,
				},
			])
		},
	}
	//Generic Program Commands:
	actions['GenericCommand'] = {
		name: 'Generic Application Command',
		options: [
			{
				label: 'Command to trigger:',
				type: 'dropdown',
				id: 'command',
				default: '/Command/General/MIDIPanic',
				choices: GenericCommands,
				width: 64,
				min: 1,
				max: 24,
				tooltip: 'Button number',
			},
		],
		callback: async (event) => {
			const cmd = await self.parseVariablesInString(event.options.command)
			const path = cmd

			self.sendOscMessage(path, [
				{
					type: 'f',
					value: 1.0,
				},
			])
		},
	}

	actions['globalsnapshotnr'] = {
		name: 'Recall global snapshot #',
		options: [
			{
				label: 'number',
				type: 'number',
				id: 'snapshot',
				width: 64,
				default: 1,
				min: 1,
				max: 9999,
				tooltip: 'You can recall a snapshot by its number',
			},
		],
		callback: async (event) => {
			const val = Number(await self.parseVariablesInString(event.options.snapshot)) - 1
			const path = '/GlobalSnapshots/Recall'

			self.sendOscMessage(path, [
				{
					type: 'i',
					value: val,
				},
			])
		},
	}

	actions['globalsnapshotname'] = {
		name: 'Recall global snapshot by name',
		options: [
			{
				type: 'textinput',
				id: 'snapshotname',
				label: 'Global snapshot name',
				width: 12,
				tooltip: 'You can recall a snapshot by its name',
			},
		],
		callback: async (event) => {
			const val = await self.parseVariablesInString(event.options.snapshotname)
			const path = '/GlobalSnapshots/Recall'

			self.sendOscMessage(path, [
				{
					type: 's',
					value: val,
				},
			])
		},
	}

	actions['FireNextCue'] = {
		name: 'Cue list: GO Next Cue',
		options: [],
		callback: async (event) => {
			self.sendOscMessage('/Command/CueLists/FireNextCue')
		},
	}
	actions['FirePreviousCue'] = {
		name: 'Cue list: GO Previous Cue',
		options: [],
		callback: async (event) => {
			self.sendOscMessage('/Command/CueLists/FirePreviousCue')
		},
	}
	actions['StepUp'] = {
		name: 'Cue list: Step Up',
		options: [],
		callback: async (event) => {
			self.sendOscMessage('/Command/CueLists/StepUp')
		},
	}

	actions['StepDown'] = {
		name: 'Cue list: Step Down',
		options: [],
		callback: async (event) => {
			self.sendOscMessage('/Command/CueLists/StepDown')
		},
	}
	actions['Gototop'] = {
		name: 'Cue list: Go To Top',
		options: [],
		callback: async (event) => {
			self.sendOscMessage('/Command/CueLists/Gototop')
		},
	}
	actions['StopAllCues'] = {
		name: 'Cue list: Stop All Cues',
		options: [],
		callback: async (event) => {
			self.sendOscMessage('/Command/CueLists/StopAllCues')
		},
	}

	actions['RecallCue'] = {
		name: 'Cue List: Recall cue #',
		options: [
			{
				type: 'textinput',
				id: 'cuenumber',
				label: 'Cue number',
				width: 12,
			},
		],
		callback: async (event) => {
			const val = await self.parseVariablesInString(event.options.cuenumber)
			const path = '/Cue/Recall'

			self.sendOscMessage(path, [
				{
					type: 's',
					value: val,
				},
			])
		},
	}

	actions['recallcuefromlist'] = {
		name: 'Cue list: Recall cue from list',
		options: [
			{
				type: 'textinput',
				id: 'listnumber',
				label: 'List Number',
				width: 12,
			},
			{
				type: 'textinput',
				id: 'cuenumber',
				label: 'Cue Number',
				width: 12,
			},
		],
		callback: async (event) => {
			const cue = await self.parseVariablesInString(event.options.cuenumber)
			const list = await self.parseVariablesInString(event.options.listnumber)
			const path = '/Cue/Recall'

			self.sendOscMessage(path, [
				{
					type: 's',
					value: list,
				},
				{
					type: 's',
					value: cue,
				},
			])
		},
	}

	actions['RecallViewSet'] = {
		name: 'Recall View Set #',
		options: [
			{
				label: 'number',
				type: 'number',
				id: 'viewset',
				width: 64,
				default: 1,
				min: 1,
				max: 9999,
				tooltip: 'You can recall a view set by its number',
			},
		],
		callback: async (event) => {
			const viewset = await self.parseVariablesInString(event.options.viewset)

			const path = '/ViewSets/Recall'

			self.sendOscMessage(path, [
				{
					type: 'i',
					value: viewset - 1,
				},
			])
		},
	}

	//Generic Buttons:
	actions['GenericButton'] = {
		name: 'Generic Button',
		options: [
			{
				label: 'LiveProfessor Button Number:',
				type: 'textinput',
				id: 'buttonNr',
				width: 64,
				default: 1,
				min: 1,
				max: 24,
				tooltip: 'Button number',
			},
		],
		callback: async (event) => {
			const nr = await self.parseVariablesInString(event.options.buttonNr)
			const path = '/Companion/GenericButtons/Button' + nr

			self.sendOscMessage(path, [
				{
					type: 'f',
					value: 1.0,
				},
			])
		},
	}
	return actions
}
