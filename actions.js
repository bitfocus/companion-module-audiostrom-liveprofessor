exports.getActions  = function() {

	var actions = {}

	const GenericCommands = [
		{ label: 'General - MIDI Panic', id: '/Command/General/MIDIPanic'},
		{ label: 'Project - New Project', id: '/Command/Project/NewProject'},
		{ label: 'Project - Open Project', id: '/Command/Project/OpenProject'},
		{ label: 'Project - Save Project', id: '/Command/Project/SaveProject'},
		{ label: 'Project - Save As', id: '/Command/Project/SaveAs'},
		{ label: 'Project - Save Project As Template', id: '/Command/Project/SaveAsTemplate'},
		{ label: 'Project - Close Project', id: '/Command/Project/CloseProject'},
		{ label: 'Project - Rename Project', id: '/Command/Project/RenameProject'},
		{ label: 'Options - Plugin Manager', id: '/Command/Options/PluginManager'},
		{ label: 'Options - Audio & Midi Options', id: '/Command/Options/Audio&MidiOptions'},
		{ label: 'Options - Program Options', id: '/Command/Options/ProgramOptions'},
		{ label: 'Options - Project Options', id: '/Command/Options/ProjectOptions'},
		{ label: 'Options - Keyboard Shortcuts', id: '/Command/Options/KeyboardShortcuts'},
		{ label: 'View - Audio Routing Panel', id: '/Command/View/PluginAudioRouting'},
		{ label: 'View - Midi Panel', id: '/Command/View/PluginMidiPanel'},
		{ label: 'View - Plugin Snapshot Panel', id: '/Command/View/PluginSnapshotPanel'},
		{ label: 'View - Plugin Preset Panel', id: '/Command/View/PluginPresetList'},
		{ label: 'View - Cue Lists Panel', id: '/Command/View/CueListPanel'},
		{ label: 'View - Global Snapshots Panel', id: '/Command/View/GlobalSnapshotsPanel'},
		{ label: 'View - Transport Panel', id: '/Command/View/TransportPanel'},
		{ label: 'View - Workspace Panel', id: '/Command/View/WorkspacePanel'},
		{ label: 'View - Full Screen', id: '/Command/View/FullScreen'},
		{ label: 'Transport & Tempo - Tap Tempo', id: '/Command/Transport&Tempo/TempoTap'},
		{ label: 'Transport & Tempo - Midi Clock Sync On/Off', id: '/Command/Transport&Tempo/MidiClockSyncOnOff'},
		{ label: 'Transport & Tempo - Return To Zero', id: '/Command/Transport&Tempo/ReturnToZero'},
		{ label: 'Transport & Tempo - Start/Stop Transport', id: '/Command/Transport&Tempo/StartStopTransport'},
		{ label: 'ViewModes - Chains', id: '/Command/ViewModes/Chains'},
		{ label: 'ViewModes - Live Cue List', id: '/Command/ViewModes/LiveCueList'},
		{ label: 'ViewModes - Patch View', id: '/Command/ViewModes/PatchView'},
		{ label: 'ViewModes - Wire View', id: '/Command/ViewModes/WireView'},
		{ label: 'ViewModes - Zoom In Wire View', id: '/Command/ViewModes/ZoomInWireView'},
		{ label: 'ViewModes - Zoom Out Wire View', id: '/Command/ViewModes/ZoomOutWireView'},
		{ label: 'Chains - Add New Chain', id: '/Command/Chains/AddNewChain'},
		{ label: 'Global Snapshots - Add New Global Snapshot', id: '/Command/GlobalSnapshots/AddNewGlobalSnapshot'},
		{ label: 'Global Snapshots - Update Active Global Snapshot', id: '/Command/GlobalSnapshots/UpdateActiveGlobalSnapshot'},
		{ label: 'Global Snapshots - Recall Next Snapshot', id: '/Command/GlobalSnapshots/RecallNextGlobalSnapshot'},
		{ label: 'Global Snapshots - Recall Previous Snapshot', id: '/Command/GlobalSnapshots/RecallPreviousGlobalSnapshot'},
		{ label: 'Controllers - Hardware Controllers Setup', id: '/Command/Controllers/HardwareControllersSetup'},
		{ label: 'Controllers - Map Controllers', id: '/Command/Controllers/MapControllers'},
		{ label: 'Controllers - Quick Assign', id: '/Command/Controllers/QuickAssign'},
		{ label: 'Selected Plugin - Enable Processing', id: '/Command/SelectedPlugin/EnableProcessingonselectedplugin'},
		{ label: 'Selected Plugin - Bypass', id: '/Command/SelectedPlugin/EnableBypassonselectedplugin'},
		{ label: 'Selected Plugin - Audio Mute', id: '/Command/SelectedPlugin/EnableAudioMuteonselectedplugin'},
		{ label: 'Selected Plugin - MIDI Mute', id: '/Command/SelectedPlugin/EnableMIDIMuteonselectedplugin'},
		{ label: 'Selected Plugin - ISO-Mode', id: '/Command/SelectedPlugin/EnableISO-Modeonselectedplugin'},
		{ label: 'Selected Plugin - Update Active Snapshot', id: '/Command/SelectedPlugin/UpdateActiveSnapshot'},
		{ label: 'Selected Plugin - Create New PluginSnapshot', id: '/Command/SelectedPlugin/CreateNewPluginSnapshot'},
		{ label: 'Selected Plugin - Rename Active Snapshot', id: '/Command/SelectedPlugin/RenameActiveSnapshot'},
		{ label: 'Selected Plugin - Duplicate Selected Plugin', id: '/Command/SelectedPlugin/Duplicateselectedplugin'},
		{ label: 'Selected Plugin - Remove Selected Plugin', id: '/Command/SelectedPlugin/Removeselectedplugin'},
		{ label: 'Plugin Windows - Show/Hide Selected Plugin', id: '/Command/PluginWindows/ShowHideselectedplugin'},
		{ label: 'Plugin Windows - TogglePluginWindows', id: '/Command/PluginWindows/TogglePluginWindows'},
		{ label: 'Plugin Windows - Send All To Back', id: '/Command/PluginWindows/Sendalltoback'},
		{ label: 'Plugin Windows - Send All To Front', id: '/Command/PluginWindows/Sendalltofront'},
		{ label: 'Plugin Windows - Select Next Chain', id: '/Command/PluginWindows/SelectNextChain'},
		{ label: 'Plugin Windows - Select Previous Chain', id: '/Command/PluginWindows/SelectPreviousChain'},
		{ label: 'Plugin Windows - Select Next Plugin', id: '/Command/PluginWindows/SelectNextPlugin'},
		{ label: 'Plugin Windows - Select Previous Plugin', id: '/Command/PluginWindows/SelectPreviousPlugin'}

	]


	actions['genericcommand'] = {
		label: 'Generic Application Command',
		options: [
			{
				label: 'number',
				type: 'dropdown',
				id: 'command',
				default: '/Command/General/MIDIPanic',
				choices: GenericCommands

			}
		]
	}

	actions['globalsnapshotnr'] = {
		label: 'Recall global snapshot #',
		options: [
			{
				label: 'number',
				type: 'number',
				id: 'snapshot',
				width: 64,
				default: 1,
				min: 1,
				max: 9999,
				tooltip: 'You can recall a snapshot by its number'
			}
		]
	}

	actions['globalsnapshotname'] = {
		label: 'Recall global snapshot by name',
		options: [
			{
				label: 'number',
				type: 'textinput',
				id: 'snapshotname',
				label: 'Global snapshot name',
				width: 12,
				tooltip: 'You can recall a snapshot by its name'
			}
		]
	}

	actions['FireNextCue'] = {
		label: 'GO Next Cue'
	}
	actions['FirePreviousCue'] = {
		label: 'GO Previous Cue'
	}
	actions['StepUp'] = {
		label: 'Cue list Step Up'
	}

	actions['StepDown'] = {
		label: 'Cue list Step Down'
	}
	actions['Gototop'] = {
		label: 'Cue list Go To Top'
	}
	actions['StopAllCues'] = {
		label: 'Stop All'
	}

	actions['recallcue'] = {
		label: 'Recall cue',
		options: [
			{
				label: 'number',
				type: 'textinput',
				id: 'cuenumber',
				label: 'Cue number',
				width: 12
			}
		]
	}
	actions['recallcuefromlist'] = {
		label: 'Recall cue from list',
		options: [{
			label: 'number',
			type: 'textinput',
			id: 'listnumber',
			label: 'List number',
			width: 12
			},
			{
				label: 'number',
				type: 'textinput',
				id: 'cuenumber',
				label: 'Cue number',
				width: 12
			}
		]
	}

	actions['recallviewset'] = {
		label: 'Recall View Set #',
		options: [
			{
				label: 'number',
				type: 'number',
				id: 'viewset',
				width: 64,
				default: 1,
				min: 1,
				max: 9999,
				tooltip: 'You can recall a view set by its number'
			}
		]
	}

		actions['GenericButton'] = {
			label: 'Generic Button',
			options: [
				{
					label: 'number',
					type: 'number',
					id: 'buttonNr',
					width: 64,
					default: 1,
					min: 1,
					max: 24,
					tooltip: 'Button number'
				}
			]
		}



	return actions
}
