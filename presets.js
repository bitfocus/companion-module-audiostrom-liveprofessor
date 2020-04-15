exports.getPresets  = function() {
    var presets = [];

    var i;
    for (i = 1; i < 25; i++) {
        presets.push({
            category: 'Global Snapshots',
            label: 'Global Snapshot '+i,
            bank: {
                style: 'text',
                text: '$(LiveProfessor:GSname'+i+')',
                size: 'pstSize',
                color: '16777215',
                bgcolor: this.rgb(0, 0, 0)
            },
            actions: [{
                action: 'globalsnapshotnr',
                options: {
                    snapshot: i
                }
            }],
            feedbacks: [
                {
                    type: 'snapshotrecalled',
                    options: {
                        snapshotnr: i,
                    }
                }
            ]
        });
    }

    presets.push({
        category: 'Global Snapshots',
        label: 'Recall Next Snapshot',
        bank: {
            style: 'text',
            text: 'Recall Next',
            color: '16777215',
            size: 'auto',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'genericcommand',
            options: {
                command: '/Command/GlobalSnapshots/RecallNextGlobalSnapshot'
            }
        }]
    });

    presets.push({
        category: 'Global Snapshots',
        label: 'Recall Previous Snapshot',
        bank: {
            style: 'text',
            text: 'Recall Previous',
            color: '16777215',
            size: 'auto',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'genericcommand',
            options: {
                command: '/Command/GlobalSnapshots/RecallPreviousGlobalSnapshot'
            }
        }]
    });

    for (i = 1; i < 25; i++) {
        presets.push({
            category: 'Generic Buttons',
            label: 'Generic Button '+i,
            bank: {
                style: 'text',
                text: 'Button '+i,
                color: '16777215',
                size: 'auto',
                bgcolor: this.rgb(0, 0, 0)
            },
            actions: [{
                action: 'GenericButton',
                options: {
                    buttonNr: i
                }
            }],
            feedbacks: [
                {
                    type: 'GenericButton',
                    options: {
                        buttonNr: i,
                    }
                }
            ]
        });
    }

    for (i = 1; i < 25; i++) {
        presets.push({
            category: 'View Sets',
            label: 'View Set '+i,
            bank: {
                style: 'text',
                text: '$(LiveProfessor:ViewSetName'+i+')',
                size: 'auto',
                color: '16777215',
                bgcolor: this.rgb(0, 0, 0)
            },
            actions: [{
                action: 'recallviewset',
                options: {
                    viewset: i
                }
            }],
            feedbacks: [
                {
                    type: 'viewsetrecalled',
                    options: {
                        viewset: i,
                    }
                }
            ]
        });
    }


    presets.push({
        category: 'Cues',
        label: 'Recall Cue by number',
        bank: {
            style: 'text',
            text: 'Recall Cue',
            color: '16777215',
            size: 'auto',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'recallcue',
            options: {
                cuenumber: "1"
            }
        }]
    });

    presets.push({
        category: 'Cues',
        label: 'Go Next',
        bank: {
            style: 'text',
            text: 'GO',
            size: '30',
            color: '16777215',
            bgcolor: this.rgb(102, 255, 51)
        },
        actions: [{
            action: 'FireNextCue'
        }]
    });

    presets.push({
        category: 'Cues',
        label: 'GO Previous Cue',
        bank: {
            style: 'text',
            text: 'GO Previous',
            size: 'auto',
            color: '16777215',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'FirePreviousCue'
        }]
    });

    presets.push({
        category: 'Cues',
        label: 'Cue list Step Up',
        bank: {
            style: 'text',
            text: 'Up',
            size: 'auto',
            color: '16777215',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'StepUp'
        }]
    });

    presets.push({
        category: 'Cues',
        label: 'Cue list Step Down',
        bank: {
            style: 'text',
            text: 'Down',
            size: 'auto',
            color: '16777215',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'StepDown'
        }]
    });

    presets.push({
        category: 'Cues',
        label: 'Stop All Cues',
        bank: {
            style: 'text',
            text: 'Stop',
            size: 'auto',
            color: '16777215',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'StopAllCues'
        }]
    });

    presets.push({
        category: 'Transport & Tempo',
        label: 'Tap Tempo',
        bank: {
            style: 'text',
            text: '$(LiveProfessor:tempo) ',
            size: 'auto',
            color: '16777215',
            bgcolor: this.rgb(0, 0, 0)
        },
        actions: [{
            action: 'genericcommand',
            command:'/Command/Transport&Tempo/TempoTap'
        }],
        feedbacks: [
            {
                type: 'tempoflash',
                options: {
                    bg: this.rgb(16, 168, 62),
                    fg: this.rgb(255, 255, 255)
                }
            }
        ]
    });

    return presets;
}