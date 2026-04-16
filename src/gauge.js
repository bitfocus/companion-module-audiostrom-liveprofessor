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

function buildHorseshoePath(width, height) {
	const leftX = width * 0.14
	const rightX = width * 0.86
	const centerX = width / 2
	const archCenterY = height * 0.31
	const archRadiusX = (rightX - leftX) / 2
	const archRadiusY = height * 0.24
	const legBottomY = height * 0.56
	const legSteps = Math.max(8, Math.round(height * 0.28))
	const archSteps = Math.max(32, Math.round(width * 1.1))
	const points = []

	for (let i = 0; i <= legSteps; i++) {
		const position = i / legSteps
		points.push({
			x: leftX,
			y: legBottomY + (archCenterY - legBottomY) * position,
		})
	}

	for (let i = 1; i <= archSteps; i++) {
		const angle = Math.PI + Math.PI * (i / archSteps)
		points.push({
			x: centerX + Math.cos(angle) * archRadiusX,
			y: archCenterY + Math.sin(angle) * archRadiusY,
		})
	}

	for (let i = 1; i <= legSteps; i++) {
		const position = i / legSteps
		points.push({
			x: rightX,
			y: archCenterY + (legBottomY - archCenterY) * position,
		})
	}

	return points
}

function drawArc(buffer, width, height, value, color, alpha, options = {}) {
	const progress = normalizePercent(value)
	const size = Math.min(width, height)
	const lineRadius = Math.max(2, size * 0.05)
	const path = buildHorseshoePath(width, height)
	const points = options.mirror ? path.reverse() : path
	const drawnSteps = Math.round((points.length - 1) * progress)

	for (let i = 0; i <= drawnSteps; i++) {
		const point = points[i]
		drawCircle(buffer, width, height, point.x, point.y, lineRadius, color, alpha)
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
exports.DEFAULT_HIGH_COLOR = DEFAULT_HIGH_COLOB
exports.getThresholdColor = getThresholdColor
exports.normalizePercent = normalizePercent
exports.renderArcGauge = renderArcGauge
