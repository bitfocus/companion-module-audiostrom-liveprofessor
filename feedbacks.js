const {combineRgb} = require("@companion-module/base");
exports.getFeedbacks = function (self) {
    var feedbacks = {
        'GenericButton': {
            type: 'boolean',
            name: 'Generic Button State',
            description: 'Change colour depending on state of Generic Button',
            defaultStyle: {
                // Move the values from options to here
                color: combineRgb(0, 0, 0),
                bgcolor: combineRgb(0, 0, 255)
            },
            // remove the old style properties from options
            options: [{
                type: 'number',
                label: 'Button Number',
                id: 'buttonNr',
                default: 1,
                width: 64,
                min: 1,
                max: 24,
            }],
            callback: (feedback) => {
                return self.liveprofessorState.buttons[feedback.options.buttonNr]
            }
        },
        'TempoFlash':{
            type: 'boolean',
            name: 'Tempo Tap Flash',
            description: 'Change color when tempo is received',
            options:[],
            defaultStyle: {
                // Move the values from options to here
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(0, 153, 0)
            },
            callback: (feedback) => {
                return self.liveprofessorState.tempoflash
            }
        },
        'SnapshotRecalled':{
            type: 'boolean',
            name: 'Global Snapshot Recalled',
            description: 'Change color when a Snapshot matches. Use number or name depending on action',
            defaultStyle: {
                // Move the values from options to here
                color: combineRgb(0, 0, 0),
                bgcolor: combineRgb(94, 194, 232)
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
                }
            ],
            callback: (feedback) => {
                return self.liveprofessorState.currentGlobalSnapshot.id==feedback.options.snapshotnr;
            }
        },
        'ViewSetRecalled': {
            type: 'boolean',
            name: 'View Set Recalled',
            description: 'Change color when view set matches number',
            defaultStyle: {
                // Move the values from options to here
                color: combineRgb(0, 0, 0),
                bgcolor: combineRgb(94, 194, 232)
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
            ],callback: (feedback) => {
                return self.liveprofessorState.currentViewSetId==feedback.options.viewset;
            }

        }


    }

    return feedbacks;

}