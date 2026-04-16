const { ROTARY_COUNT } = require('./constants')

exports.getControllerVariableName = function (controllerName, suffix) {
	const rotaryMatch = /^Rotary(\d+)$/.exec(controllerName)
	if (!rotaryMatch) return `${controllerName}${suffix}`

	const rotaryId = Number(rotaryMatch[1]) - 1
	if (rotaryId < 1 || rotaryId > ROTARY_COUNT) return undefined

	return `Rotary${rotaryId}${suffix}`
}
