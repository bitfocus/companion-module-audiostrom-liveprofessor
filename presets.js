const {combineRgb} = require("@companion-module/base");
exports.getPresets = function () {
    let presets = [];

    let i;

    presets.push({
        type: 'button',
        category: 'Global Snapshots',
        label: 'Recall Next Snapshot',
        style: {

            text: 'Recall Next',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps: [{
            down: [{
                actionId: 'GenericCommand',
                options: {
                    command: '/Command/GlobalSnapshots/RecallNextGlobalSnapshot'
                }
            }],
            up: []
        }
        ],

    });

    presets.push({
        type: 'button',
        category: 'Global Snapshots',
        label: 'Recall Previous Snapshot',
        style: {

            text: 'Recall Previous',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps: [{
            down: [{
                actionId: 'GenericCommand',
                options: {
                    command: '/Command/GlobalSnapshots/RecallPreviousGlobalSnapshot'
                }
            }],
            up: []
        }
        ],

    });

    presets.push({
        type: 'button',
        category: 'Global Snapshots',
        label: 'Update Active Snapshot',
        style: {

            text: 'Update Snapshot',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps: [{
            down: [{
                actionId: 'GenericCommand',
                options: {
                    command: '/Command/GlobalSnapshots/UpdateActiveGlobalSnapshot'
                }
            }],
            up: []
        }
        ],

    });


    for (i = 1; i < 25; i++) {
        presets.push({
            type: 'button',
            category: 'Global Snapshots',
            name: 'Global Snapshot ' + i,
            style: {

                text: '$(LiveProfessor:GSname' + i + ')',
                size: 'pstSize',
                color: '16777215',
                bgcolor: '0'
            },
            steps: [{
                down: [{
                    actionId: 'globalsnapshotnr',
                    options: {
                        snapshot: i
                    }
                }],
                up: []
            }],
            feedbacks: [
                {
                    feedbackId: 'SnapshotRecalled',
                    options: {
                        snapshotnr: i,
                    },
                    style: {
                        // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
                        color: combineRgb(0, 0, 0),
                        bgcolor: combineRgb(94, 194, 232),
                    }
                },
            ]
        });
    }

    //Generic Buttons:
    for (i = 1; i < 25; i++) {
        presets.push({
            type: 'button',
            category: 'Generic Buttons',
            label: 'Generic Button ' + i,
            style: {
                text: 'Button ' + i,
                color: '16777215',
                size: 'auto',
                bgcolor: combineRgb(0, 0, 0)
            },
            steps: [{
                down: [{
                    actionId: 'GenericButton',
                    options: {
                        buttonNr: i
                    }
                }],
                up: []
            }],
            feedbacks: [
                {
                    feedbackId: 'GenericButton',
                    options: {
                        buttonNr: i,
                    },
                    style: {
                        // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
                        color: combineRgb(0, 0, 0),
                        bgcolor: combineRgb(94, 194, 232),
                    }
                }
            ]
        });
    }

    for (i = 1; i < 25; i++) {
        presets.push({
            type: 'button',
            category: 'View Sets',
            label: 'View Set ' + i,
            style: {
                text: '$(LiveProfessor:ViewSetName' + i + ')',
                size: 'auto',
                color: '16777215',
                bgcolor: combineRgb(0, 0, 0)
            },
            steps: [{
                down: [{
                    actionId: 'RecallViewSet',
                    options: {
                        viewset: i
                    }
                }],
                up: []
            }],
            feedbacks: [
                {
                    feedbackId: 'ViewSetRecalled',
                    options: {
                        viewset: i,
                    },
                    style: {
                        // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
                        color: combineRgb(0, 0, 0),
                        bgcolor: combineRgb(94, 194, 232),
                    }
                }
            ]
        });
    }

    presets.push({
        type:'button',
        category: 'Cues',
        label: 'Recall Cue by number',
        style: {
            text: 'Recall Cue',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps:[{
            down:[{
                actionId: 'RecallCue',
                options: {
                    cuenumber: "1"
                }
            }],
            up:[]
        }]
    });

    presets.push({
        type:'button',
        category: 'Cues',
        label: 'Go Next',
        style: {
            text: 'GO',
            color: '0',
            size: 'auto',
            bgcolor: combineRgb(102, 255, 51)
        },
        steps:[{
            down:[{
                actionId: 'FireNextCue',
            }],
            up:[]
        }]
    });

    presets.push({
        type:'button',
        category: 'Cues',
        label: 'GO Previous Cue',
        style: {
            text: 'GO Previous',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps:[{
            down:[{
                actionId: 'FirePreviousCue',
            }],
            up:[]
        }]
    });

    presets.push({
        type:'button',
        category: 'Cues',
        label: 'Cue list Step Up',
        style: {
            text: 'Up',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps:[{
            down:[{
                actionId: 'StepUp',
            }],
            up:[]
        }]
    });

    presets.push({
        type:'button',
        category: 'Cues',
        label: 'Cue list Step Down',
        style: {
            text: 'Down',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps:[{
            down:[{
                actionId: 'StepDown',
            }],
            up:[]
        }]
    });

    presets.push({
        type:'button',
        category: 'Cues',
        label: 'Stop All Cues',
        style: {
            text: 'Stop',
            color: '16777215',
            size: 'auto',
            bgcolor: combineRgb(115, 0, 0)
        },
        steps:[{
            down:[{
                actionId: 'StopAllCues',
            }],
            up:[]
        }]
    });

    presets.push({
         type:'button',
         category: 'Transport & Tempo',
         label: 'Tap Tempo',
         style: {
             text: '$(LiveProfessor:tempo) ',
             size: 'auto',
             color: '16777215',
             bgcolor: combineRgb(0, 0, 0)
         },
         steps:[{
             down:[{
                 actionId: 'GenericCommand',
                 options: {
                     command: '/Command/Transport&Tempo/TempoTap'
                 }
             }],
             up:[]
         }],
         feedbacks: [
             {
                 feedbackId: 'TempoFlash',
                 style: {
                     // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
                     color: combineRgb(255, 255, 255),
                     bgcolor: combineRgb(0, 153, 0)
                 }
             }
         ]
     });


    //Presets for 4 rotatries
    for (i = 1; i < 5; i++) {
    presets.push({
        type:'button',
        category: 'Rotaries',
        label: 'Rotary '+i,
        options:{
            rotaryActions:true
        },
        style: {
            text: 'Rotary '+i,
            size: '18pt',
            color: '16777215',
            bgcolor: combineRgb(0, 0, 0)
        },
        steps:[{
            rotate_left:[{
                actionId: 'GenericRotaryLeft',
                options: {
                    rotaryId: i
                }
            }],
            rotate_right:[{
                actionId: 'GenericRotaryRight',
                options: {
                    rotaryId: i
                }
            }],
            down:[{
                actionId: 'GenericRotaryPress',
                options: {
                    rotaryId: i
                }
            }],
            up:[{
                actionId: 'GenericRotaryRelease',
                options: {
                    rotaryId: i
                }
            }]
        }],
        feedbacks: [
            {
                feedbackId: 'TempoFlash',
                style: {
                    // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
                    color: combineRgb(255, 255, 255),
                    bgcolor: combineRgb(0, 153, 0)
                }
            }
        ]
    });
    }

    return presets;
}