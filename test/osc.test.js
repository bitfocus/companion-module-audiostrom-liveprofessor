const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createRequire } = require('node:module')
const { readFileSync } = require('node:fs')
const vm = require('node:vm')
const dgram = require('node:dgram')
const { once } = require('node:events')
const osc = require('osc')
const sdk = require('@companion-module/base')

// Model only Companion's host services. Run the actual module and OSC transport.
// API 1.13+ sends prepared entity options; these callbacks receive those values.
class HostServices {
	constructor() {
		this.values = {}
		this.feedbackChecks = []
	}
	setActionDefinitions(value) {
		this.actions = value
	}
	setFeedbackDefinitions(value) {
		this.feedbacks = value
	}
	setVariableDefinitions(value) {
		this.variables = value
	}
	setPresetDefinitions(value) {
		this.presets = value
	}
	setVariableValues(value) {
		Object.assign(this.values, value)
	}
	checkFeedbacks(value) {
		this.feedbackChecks.push(value)
	}
	updateStatus(value) {
		this.status = value
	}
	log() {}
	async parseVariablesInString(value) {
		return value
	}
	oscSend(host, port, address, args = []) {
		this.sender.send(Buffer.from(osc.writePacket({ address, args }, { metadata: true })), port, host)
	}
}

function loadInstance() {
	let Instance
	const filename = require.resolve('../src/LiveProfessor')
	const localRequire = createRequire(filename)
	vm.runInNewContext(
		readFileSync(filename, 'utf8'),
		{
			require: (id) =>
				id === '@companion-module/base'
					? {
							...sdk,
							InstanceBase: HostServices,
							runEntrypoint: (value) => {
								Instance = value
							},
						}
					: localRequire(id),
			setInterval,
			clearInterval,
		},
		{ filename },
	)
	return new Instance()
}

const waitFor = async (predicate) => {
	const deadline = Date.now() + 3000
	while (!predicate()) {
		assert.ok(Date.now() < deadline, 'OSC response timed out')
		await new Promise((resolve) => setTimeout(resolve, 10))
	}
}

test('OSC actions, cue and feedback state, configuration reload and cleanup', async (t) => {
	const server = dgram.createSocket('udp4')
	server.bind(0, '127.0.0.1')
	await once(server, 'listening')
	const received = []
	server.on('message', (buffer) => received.push(osc.readPacket(buffer, { metadata: true })))
	const reservation = dgram.createSocket('udp4')
	reservation.bind(0, '127.0.0.1')
	await once(reservation, 'listening')
	const feedbackPort = reservation.address().port
	reservation.close()
	await once(reservation, 'close')
	const instance = loadInstance()
	instance.sender = server
	t.after(async () => {
		await instance.destroy()
		server.close()
	})
	const config = { host: '127.0.0.1', port: server.address().port, feedbackPort }
	await instance.init(config)
	await waitFor(() => received.length >= 2)
	assert.deepEqual(
		received.slice(0, 2).map((m) => m.address),
		['/init', '/refresh'],
	)
	const action = async (id, options = {}) => {
		const count = received.length
		await instance.actions[id].callback({ options })
		await waitFor(() => received.length > count)
		return received.at(-1)
	}
	assert.equal((await action('FireNextCue')).address, '/Command/CueLists/FireNextCue')
	assert.equal((await action('RecallCue', { cuenumber: '12.5' })).args[0].value, '12.5')
	const cue = await action('recallcuefromlist', { listnumber: '2', cuenumber: '3.1' })
	assert.deepEqual(
		cue.args.map((a) => a.value),
		['2', '3.1'],
	)
	assert.equal((await action('globalsnapshotnr', { snapshot: 3 })).args[0].value, 2)
	assert.equal(
		(await action('globalsnapshotname', { snapshotname: 'Prepared snapshot' })).args[0].value,
		'Prepared snapshot',
	)
	assert.equal((await action('RecallViewSet', { viewset: 4 })).args[0].value, 3)
	await action('GenericRotaryPress', { rotaryId: 2 })
	const rotary = await action('GenericRotaryRight', { rotaryId: 2 })
	assert.equal(rotary.address, '/Companion/Rotary2')
	assert.ok(Math.abs(rotary.args[0].value - 0.005) < 1e-6)
	await action('GenericRotaryRelease', { rotaryId: 2 })
	await action('GenericRotaryLeft', { rotaryId: 2 })
	assert.equal(instance.liveprofessorState.rotaryValues[1], 0)
	const send = async (address, args, predicate) => {
		server.send(Buffer.from(osc.writePacket({ address, args }, { metadata: true })), feedbackPort, '127.0.0.1')
		await waitFor(predicate)
	}
	await send(
		'/LiveProfessor/CueLists/NextCue',
		[{ type: 's', value: 'Next' }],
		() => instance.values.NextCueName === 'Next',
	)
	await send(
		'/LiveProfessor/CueLists/ActiveCue',
		[{ type: 's', value: 'Active' }],
		() => instance.values.ActiveCueName === 'Active',
	)
	await send(
		'/LiveProfessor/GlobalSnapshots/Recalled',
		[
			{ type: 's', value: 'Snapshot' },
			{ type: 'i', value: 2 },
		],
		() => instance.values.ActiveGlobalSnapshot === 'Snapshot',
	)
	assert.equal(instance.feedbacks.SnapshotRecalled.callback({ options: { snapshotnr: 3 } }), true)
	assert.equal(instance.feedbacks.SnapshotRecalled.callback({ options: { snapshotnr: 4 } }), false)
	await send(
		'/Companion/GenericButtons/Button1',
		[{ type: 'f', value: 1 }],
		() => instance.liveprofessorState.buttons[1] === 1,
	)
	assert.equal(instance.feedbacks.GenericButton.callback({ options: { buttonNr: 1 } }), true)
	await send(
		'/Controller/QuickAssign',
		[{ type: 'i', value: 1 }],
		() => instance.liveprofessorState.quickAssignMode === 1,
	)
	await send('/LiveProfessor/TempoChange', [{ type: 'f', value: 120 }], () => instance.values.tempo === 120)
	await waitFor(() => instance.feedbackChecks.includes('TempoFlash'))
	const oldPort = instance.oscUdp
	const closed = once(oldPort, 'close')
	await instance.configUpdated(config)
	await closed
	await waitFor(() => received.filter((m) => m.address === '/init').length === 2)
	await action('StopAllCues')
	await instance.destroy()
	assert.equal(instance.oscUdp, null)
	const count = instance.feedbackChecks.length
	await new Promise((resolve) => setTimeout(resolve, 300))
	assert.equal(instance.feedbackChecks.length, count)
})
