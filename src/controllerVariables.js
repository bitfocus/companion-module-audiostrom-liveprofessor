const { ROTARY_COUNT } = require('./constants')

function getRotaryVariableName(rotaryId, suffix) {
	if (!Number.isInteger(rotaryId) || rotaryId < 1 || rotaryId > ROTARY_COUNT) return undefined

	return `Rotary${rotaryId}${suffix}`
}

exports.getControllerVariableName = function (controllerName, suffix, fallbackRotaryId) {
	if (!controllerName) return getRotaryVariableName(fallbackRotaryId, suffix)

	const rotaryMatch = /^Rotary(\d+)$/.exec(controllerName)
	if (!rotaryMatch) return `${controllerName}${suffix}`

	const rotaryId = Number(rotaryMatch[1]) - 1
	return getRotaryVariableName(rotaryId, suffix)
}

exports.getRotaryVariableName = getRotaryVariableName
