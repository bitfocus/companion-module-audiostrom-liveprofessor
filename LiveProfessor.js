const {InstanceBase, Regex, runEntrypoint} = require("@companion-module/base");

//var presets = require('./presets')
const osc = require("osc");
const UpgradeScripts = require('./upgrades')
const {getActions} = require("./actions");
const {getFeedbacks} = require("./feedbacks");
const {SomeCompanionConfigField} = require("@companion-module/base/dist/module-api/config");


var tempoTimer
let states={} //TODO remove
class LiveProfessorInstance extends InstanceBase {
    constructor(internal) {
        super(internal)
    }

    async init(config, isFirstInit) {

        this.config = config
        this.liveprofessorState = {
            buttons:[],
            tempoflash:false,
            ping:false
        }
        //Set default ports
        if (!this.config.feedbackPort) this.config.feedbackPort = 8011
        if (!this.config.port) this.config.port = 8010

        this.init_actions()
        this.init_feedbacks()
        this.init_variables()
        this.init_osc();
        this.updateStatus('ok')

    }

    // When module gets deleted
    async destroy() {

    }

    //Called when the configuration changes
    async configUpdated(config ) {

        //TODO: For some reason this is never called. No idea why. Lets just init OSC in the init function..
        this.log("debug", "LP Module Config Change")
        this.config = config

        this.init_osc();

    }

    // Return config fields for web config
    getConfigFields() {

        return [
            {
                type: 'static-text',
                id: 'info',
                width: 12,
                label: 'Information',
                value: 'You need to also add the Companion Controller to LiveProfessor in the Hardware Controllers window',
            },
            {
                type: 'textinput',
                id: 'host',
                label: 'LiveProfessor IP-Address',
                width: 6,
                default: '127.0.0.1',
                regex: Regex.IP,
            },
            {
                type: 'number',
                id: 'port',
                label: 'LiveProfessor input port (default 8010)',
                default: 8010,
                min: 1,
                max: 65535,
                regex: Regex.PORT

            },
            {
                type: 'number',
                id: 'feedbackPort',
                label: 'LiveProfessor output port (default 8011)',
                width: 6,
                default: 8011,
                min: 1,
                max: 65535,
                regex: Regex.PORT

            }


        ]

    }

    sendOscMessage = (path, args) => {
        this.oscSend(this.config.host, this.config.port, path, args)
    }

    init_actions() {
        this.setActionDefinitions(getActions(this));
    }

    //Timer used to flash the tempo in the "tap-tempo" button
    tempoTimer() {
      //  this.liveprofessorState.tempoflash = !this.liveprofessorState.tempoflash
       // this.checkFeedbacks('TempoFlash')
    }


    init_feedbacks() {
        this.setFeedbackDefinitions(getFeedbacks(this));
    }

    //Seems to store some states

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
            this.setVariableValues({['GSName' + i]: 'Snap ' + (i + 1)})
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
    //Init OSC return from LiveProfessor to companion to update button states and variables.
        if (this.connecting) {
            this.log('info', 'Already connecting..')
            return
        }

        this.log('info', 'Connecting to LiveProfessor')

        this.oscUdp = new osc.UDPPort({
            localAddress: '127.0.0.1',
            localPort: this.config.feedbackPort,
            address: this.config.host,
            port: this.config.port,
            metadata: true,
        })

        this.connecting = true
        this.log('info', 'opening')
        this.oscUdp.open()
        this.log('info', 'open')

        this.oscUdp.on('error', (err) => {

            this.log('error', 'Error: ' + err.message)
            console.log('error', 'Error: ' + err.message)
            this.connecting = false
            this.updateStatus(ConnectionFailure, "Can't connect to LiveProfessor")
            if (err.code == 'ECONNREFUSED') {
                this.qSocket.removeAllListeners()
                console.log('error', 'ECONNREFUSED')
            }
        })

       this.oscUdp.on('close', () => {
            console.log('debug', 'Connection to LiveProfessor Closed')
            this.connecting = false
           this.updateStatus(ConnectionFailure,'closed')

        })

         this.oscUdp.on('ready', () => {
            this.connecting = false
            this.log('info', 'Connected to LiveProfessor:' + this.config.host)
            console.log('info', 'Connected to LiveProfessor:' + this.config.host)
            // this.sendOSC('/GlobalSnapshots/Refresh', [])
             this.updateStatus('ok')
        })

        this.oscUdp.on('message', (message) => {
            this.processMessage(message)
        })

        this.oscUdp.on('data', (data) => {
        })
    }

    //Process OSC Message from LiveProfessor and update variables in Compoanion etc
    processMessage(message) {

        let address = message.address
        let args = message.args
        this.log('info', "OSC input "+address)


        if (address.match('CueLists/NextCue')) {
            this.setVariableValues({'NextCueName': args[0].value})
        } else if (address.match('CueLists/ActiveCue')) {
            this.setVariableValues({'ActiveCueName': args[0].value})
        } else if (address.match('GlobalSnapshots/Recalled')) {
            states['currentGs'] = {id: args[1].value, name: args[0].value}
            this.setVariableValues({['GSname' + args[1].value + 1]: args[0].value})
            this.setVariableValues({'ActiveGlobalSnapshot': args[0].value})

            this.checkFeedbacks('snapshotrecalled')
        } else if (address.match('GlobalSnapshots/Name')) {
            /* Global Snapshots */
            this.setVariableValues({['GSname' + (args[1].value + 1)]: args[0].value})
        } else if (address.match('GlobalSnapshots/Added')) {
            this.setVariableValues({['GSname' + (args[1].value + 1)]: args[0].value})
        } else if (address.match('GlobalSnapshots/Removed')) {
            this.setVariableValues({['GSname' + (args[1].value + 1)]: 'Snap ' + args[1].value + 1})
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
            this.setVariableValues({['ViewSetName' + (args[1].value + 1)]: args[0].value})
        }
        if (address.match('/LiveProfessor/Ping')) {
            //Get button nr:
            this.liveprofessorState.ping = !this.liveprofessorState.ping
            this.checkFeedbacks('ping')
        }
        if (address.match('/LiveProfessor/TempoChange')) {
            //Get button nr:
            this.liveprofessorState.tempoflash = !this.liveprofessorState.tempoflash
            let tempo = args[0].value
            this.setVariableValues({'tempo': Math.round(tempo)})
            clearInterval(tempoTimer)
            var _this = this
            tempoTimer = setInterval(function () {
                _this.tempoTimer()
            }, 60000 / tempo / 2)
        }
        /* Generic Buttons */
        if (address.match('/LiveProfessor/GenericButton')) {
            //Get button nr:
            let nr = parseInt(address.substring(36))
            this.liveprofessorState.buttons[nr] = args[0].value
            this.checkFeedbacks('GenericButton')
        } else {

        }

    }


}

runEntrypoint(LiveProfessorInstance, UpgradeScripts)
