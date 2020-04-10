exports.getActions  = function() {

	var actions = {}

	const GenericCommands = [
		{ label: 'General/MIDIPanic', id: '/Command/General/MIDIPanic'},
		{ label: 'Project/NewProject', id: '/Command/Project/NewProject'},
		{ label: 'Project/OpenProject', id: '/Command/Project/OpenProject'},
		{ label: 'Project/SaveProject', id: '/Command/Project/SaveProject'},
		{ label: 'Project/SaveAs', id: '/Command/Project/SaveAs'},
		{ label: 'Project/SaveAsTemplate', id: '/Command/Project/SaveAsTemplate'},
		{ label: 'Project/CloseProject', id: '/Command/Project/CloseProject'},
		{ label: 'Project/RenameProject', id: '/Command/Project/RenameProject'},
		{ label: 'Options/PluginManager', id: '/Command/Options/PluginManager'},
		{ label: 'Options/Audio&MidiOptions', id: '/Command/Options/Audio&MidiOptions'},
		{ label: 'Options/ProgramOptions', id: '/Command/Options/ProgramOptions'},
		{ label: 'Options/ProjectOptions', id: '/Command/Options/ProjectOptions'},
		{ label: 'Options/KeyboardShortcuts', id: '/Command/Options/KeyboardShortcuts'},
		{ label: 'View/PluginAudioRouting', id: '/Command/View/PluginAudioRouting'},
		{ label: 'View/PluginMidiPanel', id: '/Command/View/PluginMidiPanel'},
		{ label: 'View/PluginSnapshotPanel', id: '/Command/View/PluginSnapshotPanel'},
		{ label: 'View/PluginPresetList', id: '/Command/View/PluginPresetList'},
		{ label: 'View/Navigator', id: '/Command/View/Navigator'},

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
		label: 'Cue Go To Top'
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
