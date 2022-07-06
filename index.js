var instance_skel = require('../../instance_skel')
var actions = require('./actions')
var presets = require('./presets')
var OSC = require('osc')

var debug
var log
let states = {}
var tempoTimer

class instance extends instance_skel {
    constructor(system, id, config) {
        super(system, id, config)

        Object.assign(this, {...actions})
        Object.assign(this, {...presets})
        this.actions()
    }

    actions(system) {
        this.setActions(this.getActions())
    }

    myTimer() {
        states['tempoflash'] = !states['tempoflash']
        this.checkFeedbacks('tempoflash')
    }

    config_fields() {
        return [
            {
                type: 'text',
                id: 'info',
                width: 12,
                label: 'Information',
                value: 'You need to also add the Companion Controller to LiveProfessor in the Hardware Controllers window',
            },
            {
                type: 'textinput',
                id: 'host',
                label: 'LiveProfessor IP',
                width: 6,
                default: '127.0.0.1',
                regex: this.REGEX_IP
            },
            {
                type: 'number',
                id: 'port',
                label: 'LiveProfessor input port (default 8010)',
                default:8010,
                min: 1,
                max: 65535,

            },
            {
                type: 'number',
                id: 'feedbackPort',
                label: 'LiveProfessor output port (default 8011)',
                width: 6,
                default:8011,
                min: 1,
                max: 65535

            }


        ]
    }

    action(action) {
        let id = action.action
        let cmd, arg
        let opt = action.options

        switch (id) {
            case 'globalsnapshotnr':
                arg = [
                    {
                        type: 'i',
                        value: parseInt(opt.snapshot) - 1,
                    },
                ]
                cmd = '/GlobalSnapshots/Recall'
                break

            case 'globalsnapshotname':
                arg = [
                    {
                        type: 's',
                        value: opt.snapshotname,
                    },
                ]
                cmd = '/GlobalSnapshots/Recall'
                break

            case 'recallcue':
                arg = [
                    {
                        type: 's',
                        value: opt.cuenumber,
                    },
                ]
                cmd = '/Cue/Recall'
                break

            case 'recallcuefromlist':
                arg = [
                    {
                        type: 's',
                        value: opt.listnumber,
                    },
                    {
                        type: 's',
                        value: opt.cuenumber,
                    },
                ]
                cmd = '/Cue/Recall/'
                break

            case 'FireNextCue':
                arg = []
                cmd = '/Command/CueLists/FireNextCue'
                break
            case 'StepUp':
                arg = []
                cmd = '/Command/CueLists/StepUp'
                break
            case 'StepDown':
                arg = []
                cmd = '/Command/CueLists/StepDown'
                break
            case 'StopAllCues':
                arg = []
                cmd = '/Command/CueLists/StopAllCues'
                break
            case 'FirePreviousCue':
                arg = []
                cmd = '/Command/CueLists/FirePreviousCue'
                break
            case 'Gototop':
                arg = []
                cmd = '/Command/CueLists/Gototop'
                break

            case 'recallviewset':
                arg = [
                    {
                        type: 'i',
                        value: parseInt(opt.viewset) - 1,
                    },
                ]
                cmd = '/ViewSets/Recall'
                break

            case 'genericcommand':
                cmd = opt.command
                break

            case 'GenericButton':
                cmd = '/LiveProfessor/GenericButtons/Button' + opt.buttonNr
                arg = [
                    {
                        type: 'f',
                        value: 1,
                    },
                ]
                break
        }

        if (arg == null) {
            arg = []
        }

        this.sendOSC(cmd, arg)
    }

    init_feedbacks() {
        var feedbacks = {}

        feedbacks['GenericButton'] = {
            label: 'Generic Button',
            description: 'Change colour',
            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground color',
                    id: 'fg',
                    default: this.rgb(255, 255, 255),
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(0, 255, 0),
                },
                {
                    label: 'Button Number',
                    type: 'number',
                    id: 'buttonNr',
                    width: 64,
                    default: 1,
                    min: 1,
                    max: 24,
                },
            ],
        }
        feedbacks['snapshotrecalled'] = {
            label: 'Global Snapshot Recalled',
            description: 'Use number or name depending on action',
            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground color',
                    id: 'fg',
                    default: this.rgb(0, 0, 0),
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(94, 194, 232),
                },
                {
                    label: 'Snapshot Number',
                    type: 'number',
                    id: 'snapshotnr',
                    width: 64,
                    default: 0,
                    min: 0,
                    max: 9999,
                },
                {
                    label: 'Name',
                    type: 'textinput',
                    id: 'snapshotname',
                },
            ],
        }

        feedbacks['viewsetrecalled'] = {
            label: 'View Set Recalled',
            description: 'Change color when view set matches',
            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground color',
                    id: 'fg',
                    default: this.rgb(0, 0, 0),
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(94, 194, 232),
                },
                {
                    label: 'View Set Number',
                    type: 'number',
                    id: 'viewset',
                    width: 64,
                    default: 0,
                    min: 0,
                    max: 9999,
                },
            ],
        }

        feedbacks['ping'] = {
            label: 'Ping',
            description: 'Change color when ping is received',
            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground color',
                    id: 'fg',
                    default: this.rgb(0, 0, 0),
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(94, 255, 0),
                },
            ],
        }

        feedbacks['tempoflash'] = {
            label: 'Tempo Tap Flash',
            description: 'Change color when ping is received',

            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground color',
                    id: 'fg',
                    default: this.rgb(0, 0, 0),
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(94, 255, 0),
                },
            ],
        }

        this.setFeedbackDefinitions(feedbacks)
    }

    //Seems to store some states
    feedback(feedback) {
        if (feedback.type === 'GenericButton') {
            if (states['GenericButton' + feedback.options.buttonNr] == 1) {
                return {color: feedback.options.fg, bgcolor: feedback.options.bg}
            }
        }

        if (feedback.type === 'snapshotrecalled') {
            if (states['currentGs'].id === parseInt(feedback.options.snapshotnr) - 1) {
                return {color: feedback.options.fg, bgcolor: feedback.options.bg}
            } else if (states['currentGs'].name === feedback.options.snapshotname) {
                return {color: feedback.options.fg, bgcolor: feedback.options.bg}
            }
        }

        if (feedback.type === 'viewsetrecalled') {
            if (states['currentViewSet'] === parseInt(feedback.options.viewset) - 1) {
                return {color: feedback.options.fg, bgcolor: feedback.options.bg}
            }
        }

        if (feedback.type === 'ping') {
            if (states['ping'] == true) {
                return {color: feedback.options.fg, bgcolor: feedback.options.bg}
            }
        }
        if (feedback.type === 'tempoflash') {
            if (states['tempoflash'] == true) {
                if (feedback.options) {
                    return {color: feedback.options.fg, bgcolor: feedback.options.bg}
                }
            }
        }

        return {}
    }

    destroy() {
        this.status(this.STATUS_UNKNOWN, 'Disabled')
        debug('destroy', this.id)
    }

    init() {
        debug = this.debug
        log = this.log
        console.log('Init LiveProfessor')
        if (!this.config.feedbackPort){
            this.config.feedbackPort = 8011
        }
        if (!this.config.port) this.config.port = 8010


        this.init_feedbacks()
        this.init_variables()
        this.status(this.STATE_OK)
        this.init_presets()
        this.init_osc()
        states['currentGs'] = {id: -1, name: ''}
        states['currentViewSet'] = -1
        states['ping'] = false
        states['tempoflash'] = false

        this.sendOSC('/ViewSets/Refresh', [])
        this.sendOSC('/GlobalSnapshots/Refresh', [])
        this.sendOSC('/Init', [])
    }

    updateConfig(config) {
        console.log("LP UPDATE config")

        if ((config.host!=this.config.host) || (config.port!=this.config.port) || (config.feedbackPort!=this.config.feedbackPort))
        {
            this.config = config
            this.init_osc();
        }

        this.config = config

      //  this.actions() why?
    }

    init_variables() {
        var variables = []

        variables.push({name: 'NextCueName', label: 'Next cue to fire'})
        variables.push({name: 'ActiveCueName', label: 'Current cue to fire'})
        variables.push({name: 'ActiveGlobalSnapshot', label: 'Current global snapshot'})
        var i
        for (i = 1; i < 100; i++) {
            variables.push({name: 'GSname' + i, label: 'Global Snapshot Name ' + i})
        }

        for (i = 1; i < 24; i++) {
            variables.push({name: 'GenericButtonName' + i, label: 'Button Name Name ' + i})
        }

        for (i = 1; i < 100; i++) {
            variables.push({name: 'ViewSetName' + i, label: 'Name of View Set ' + i})
        }

        this.setVariableDefinitions(variables)

        for (i = 1; i < 100; i++) {
            this.setVariable('GSName' + i, 'Snap ' + (i + 1))
        }
        variables.push({name: 'tempo', label: 'Tempo'})
    }

    connect() {
        this.status(this.STATUS_UNKNOWN, 'Connecting')
    }

    init_presets() {
        this.setPresetDefinitions(this.getPresets())
    }

    init_osc() {
        if (this.connecting) {
            return
        }

        if (this.qSocket) {
            this.qSocket.close()
        }


        var hostAddress = '127.0.0.1'
        if (this.config.host) hostAddress = this.config.host

        if (!this.config.feedbackPort) this.config.feedbackPort = 8011
        if (!this.config.port) this.config.port = 8010
        console.log('Connecting to LiveProfessor')
        console.log('Feedback '+this.config.feedbackPort)
        console.log('Sendport '+this.config.port)
        this.qSocket = new OSC.UDPPort({
            localAddress: '127.0.0.1',
            localPort: this.config.feedbackPort,
            address: hostAddress,
            port: this.config.port,
            metadata: true,
        })
        this.connecting = true

        this.qSocket.open()

        this.qSocket.on('error', (err) => {
            debug('Error', err)
            this.log('error', 'Error: ' + err.message)
            console.log('error', 'Error: ' + err.message)
            this.connecting = false
            this.status(this.STATUS_ERROR, "Can't connect to LiveProfessor")
            if (err.code == 'ECONNREFUSED') {
                this.qSocket.removeAllListeners()
                console.log('error', 'ECONNREFUSED')
            }
        })

        this.qSocket.on('close', () => {
            console.log('debug', 'Connection to LiveProfessor Closed')
            this.connecting = false
            this.status(this.STATUS_WARNING, 'CLOSED')
        })

        this.qSocket.on('ready', () => {
            this.connecting = false
            this.log('info', 'Connected to LiveProfessor:' + hostAddress)
            console.log('info', 'Connected to LiveProfessor:' + hostAddress)
            this.sendOSC('/GlobalSnapshots/Refresh', [])
            this.status(this.STATUS_OK, 'OK')
        })

        this.qSocket.on('message', (message) => {
            this.processMessage(message)
        })

        this.qSocket.on('data', (data) => {
        })
    }

    processMessage(message) {

        let address = message.address
        let args = message.args

        /* Cues */

        if (address.match('CueLists/NextCue')) {
            this.setVariable('NextCueName', args[0].value)
        } else if (address.match('CueLists/ActiveCue')) {
            this.setVariable('ActiveCueName', args[0].value)
        } else if (address.match('GlobalSnapshots/Recalled')) {
            states['currentGs'] = {id: args[1].value, name: args[0].value}
            this.setVariable('GSname' + args[1].value + 1, args[0].value)
            this.setVariable('ActiveGlobalSnapshot', args[0].value)

            this.checkFeedbacks('snapshotrecalled')
        } else if (address.match('GlobalSnapshots/Name')) {
            /* Global Snapshots */
            this.setVariable('GSname' + (args[1].value + 1), args[0].value)
        } else if (address.match('GlobalSnapshots/Added')) {
            this.setVariable('GSname' + (args[1].value + 1), args[0].value)
        } else if (address.match('GlobalSnapshots/Removed')) {
            this.setVariable('GSname' + (args[1].value + 1), 'Snap ' + args[1].value + 1)
            this.sendOSC('GlobalSnapshots/Refresh', [])
        } else if (address.match('/LiveProfessor/GlobalSnapshots/Moved')) {
            this.sendOSC('/GlobalSnapshots/Refresh', [])
        } else if (address.match('/ViewSets/Recalled')) {
            /* View Sets */
            states['currentViewSet'] = args[0].value
            this.checkFeedbacks('viewsetrecalled')
        } else if (address.match('/ViewSets/Changed')) {
            this.sendOSC('/LiveProfessor/ViewSets/Refresh', [])
        } else if (address.match('/ViewSets/Update')) {
            this.setVariable('ViewSetName' + (args[1].value + 1), args[0].value)
        }
        if (address.match('/LiveProfessor/Ping')) {
            //Get button nr:
            states['ping'] = !states['ping']
            this.checkFeedbacks('ping')
        }
        if (address.match('/LiveProfessor/TempoChange')) {
            //Get button nr:
            states['tempoflash'] = !states['tempoflash']
            let tempo = args[0].value
            this.setVariable('tempo', Math.round(tempo))
            clearInterval(tempoTimer)
            var _this = this
            tempoTimer = setInterval(function () {
                _this.myTimer()
            }, 60000 / tempo / 2)
        }
        /* Generic Buttons */
        if (address.match('/LiveProfessor/GenericButton')) {
            //Get button nr:
            let nr = parseInt(address.substring(36))
            states['GenericButton' + nr] = args[0].value
            this.checkFeedbacks('GenericButton')
        } else {
            debug(message.address, message.args)
        }

    }

    sendOSC(node, arg) {
        var host,
            port = ''
        if (this.config.host !== undefined && this.config.host !== '') {
            host = this.config.host
        }
        this.oscSend(host, this.config.port, node, arg)
    }
}

exports = module.exports = instance
