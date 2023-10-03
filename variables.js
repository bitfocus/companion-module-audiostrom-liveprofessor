exports.getVariables = function () {
    const variables = [];

    variables.push({ variableId: 'NextCueName', name: 'Next cue to fire'})
    variables.push({variableId: 'ActiveCueName', name: 'Current cue to fire'})
    variables.push({variableId: 'ActiveGlobalSnapshot', name: 'Current global snapshot'})
    var i
    for (i = 1; i < 100; i++) {
        variables.push({variableId: 'GSname' + i, name: 'Global Snapshot Name ' + i})
    }

    for (i = 1; i < 24; i++) {
        variables.push({variableId: 'GenericButtonName' + i, name: 'Button Name Name ' + i})
    }

    for (i = 1; i < 100; i++) {
        variables.push({variableId: 'ViewSetName' + i, name: 'Name of View Set ' + i})
    }
    variables.push({variableId: 'tempo', name: 'Tempo'})
    return variables
}