const { combineRgb } = require('@companion-module/base')

const DEFAULT_LOW_COLOR = combineRgb(0, 180, 80)
const DEFAULT_MID_COLOR = combineRgb(255, 190, 0)
const DEFAULT_HIGH_COLOR = combineRgb(220, 40, 40)

function clamp(value, min, max) {
	const number = Number(value)
	if (!Number.isFinite(number)) return min

	return Math.min(max, Math.max(min, number))
}

function normalizePercent(value) {
	return clamp(value, 0, 1)
}

function getThresholdColor(value, options = {}) {
	const normalizedValue = normalizePercent(value)
	const percent = normalizedValue * 100
	const lowThreshold = clamp(options.lowThreshold ?? 65, 0, 100)
	const highThreshold = clamp(options.highThreshold ?? 85, lowThreshold, 100)

	if (percent >= highThreshold) return Number(options.highColor ?? DEFAULT_HIGH_COLOR)
	if (percent >= lowThreshold) return Number(options.midColor ?? DEFAULT_MID_COLOR)
	return Number(options.lowColor ?? DEFAULT_LOW_COLOR)
}

function colorNumberToRgb(color) {
	const number = Number(color) >>> 0
	return {
		r: (number >> 16) & 0xff,
		g: (number >> 8) & 0xff,
		b: number & 0xff,
	}
}

function drawPixel(buffer, width, height, x, y, color, alpha = 255) {
	if (x < 0 || y < 0 || x >= width || y >= height) return

	const offset = (y * width + x) * 4
	buffer[offset] = color.r
	buffer[offset + 1] = color.g
	buffer[offset + 2] = color.b
	buffer[offset + 3] = alpha
}

function drawCircle(buffer, width, height, cx, cy, radius, color, alpha = 255) {
	const minX = Math.floor(cx - radius)
	const maxX = Math.ceil(cx + radius)
	const minY = Math.floor(cy - radius)
	const maxY = Math.ceil(cy + radius)
	const radiusSq = radius * radius

	for (let y = minY; y <= maxY; y++) {
		for (let x = minX; x <= maxX; x++) {
			const dx = x - cx
			const dy = y - cy
			if (dx * dx + dy * dy <= radiusSq) drawPixel(buffer, width, height, x, y, color, alpha)
		}
	}
}

function drawArc(buffer, width, height, value, color, alpha, options = {}) {
	const progress = normalizePercent(value)
	const size = Math.min(width, height)
	const centerX = width / 2
	const centerY = height * 0.62
	const radius = size * 0.35
	const lineRadius = Math.max(2, size * 0.045)
	const leftAngle = (150 * Math.PI) / 180
	const rightAngle = (390 * Math.PI) / 180
	const startAngle = options.mirror ? rightAngle : leftAngle
	const endAngle = options.mirror ? leftAngle : rightAngle
	const sweep = endAngle - startAngle
	const steps = Math.max(48, Math.round(size * 1.5))
	const drawnSteps = Math.round(steps * progress)

	for (let i = 0; i <= drawnSteps; i++) {
		const angle = startAngle + sweep * (i / steps)
		const x = centerX + Math.cos(angle) * radius
		const y = centerY + Math.sin(angle) * radius
		drawCircle(buffer, width, height, x, y, lineRadius, color, alpha)
	}
}

function renderArcGauge(value, options = {}) {
	const width = Math.max(1, Math.round(options.width ?? 72))
	const height = Math.max(1, Math.round(options.height ?? 72))
	const displayValue = options.invert ? 1 - normalizePercent(value) : normalizePercent(value)
	const buffer = new Uint8Array(width * height * 4)
	const background = colorNumberToRgb(options.backgroundColor ?? combineRgb(70, 70, 70))
	const foreground = colorNumberToRgb(getThresholdColor(displayValue, options))

	drawArc(buffer, width, height, 1, background, 120, options)
	drawArc(buffer, width, height, displayValue, foreground, 255, options)

	return buffer
}

exports.DEFAULT_LOW_COLOR = DEFAULT_LOW_COLOR
exports.DEFAULT_MID_COLOR = DEFAULT_MID_COLOR
exports.DEFAULT_HIGH_COLOR = DEFAULT_HIGH_COLOR
exports.getThresholdColor = getThresholdColor
exports.normalizePercent = normalizePercent
exports.renderArcGauge = renderArcGauge
