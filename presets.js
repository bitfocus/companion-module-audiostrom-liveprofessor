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
            text: 'Cue 1',
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

    return presets;
}