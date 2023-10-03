const {InstanceBase, Regex, runEntrypoint} = require("@companion-module/base");

//var presets = require('./presets')
const osc = require("osc");
const UpgradeScripts = require('./upgrades')
const {getActions} = require("./actions");
const {getFeedbacks} = require("./feedbacks");
const {getPresets} = require("./presets.js")
const {getVariables} = require("./variables");


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
            ping:false,
            currentGlobalSnapshot:{id:0,name:""},
            rotaryValues:[0.0,0.0,0.0,0.0],
            rotaryPush:[false,false,false,false]
        }
        //Set default ports
        if (!this.config.feedbackPort) this.config.feedbackPort = 8011
        if (!this.config.port) this.config.port = 8010

        this.init_actions()
        this.init_feedbacks()
        this.init_variables()
        this.init_osc();
        this.init_presets();
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
        this.liveprofessorState.tempoflash = !this.liveprofessorState.tempoflash
        this.checkFeedbacks('TempoFlash')
    }


    init_feedbacks() {
        this.setFeedbackDefinitions(getFeedbacks(this));
    }

    //Seems to store some states

    init_variables() {


        this.setVariableDefinitions(getVariables())

        this.setVariableValues({
            'GenericButtonName1': 'Button 1',
            'GenericButtonName2': 'Button 2',
            'GenericButtonName3': 'Button 3',
            'GenericButtonName4': 'Button 4',
            'GenericButtonName5': 'Button 5',
            'GenericButtonName6': 'Button 6',
            'GenericButtonName7': 'Button 7',
            'GenericButtonName8': 'Button 8',
            'tempo': '120',
            'NextCueName': '',
            'ActiveCueName': '',
            'ActiveGlobalSnapshot': ''
        })
        let i;
        for (i = 1; i < 100; i++) {
            this.setVariableValues({['GSname' + i]: 'Snap ' + (i)})
        }

    }

    connect() {
        this.status(this.STATUS_UNKNOWN, 'Connecting')
    }

    init_presets() {
        this.setPresetDefinitions(getPresets())
    }

    init_osc() {
    //Init. OSC to return state from LiveProfessor to companion to update button colors and variables.
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
            this.sendOscMessage('/init');
             this.sendOscMessage('/refresh');

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
        }
        else if (address.match('CueLists/ActiveCue')) {
            this.setVariableValues({'ActiveCueName': args[0].value})
        }
        else if (address.match('GlobalSnapshots/Recalled')) {
            this.liveprofessorState.currentGlobalSnapshot = {id: args[1].value+1, name: args[0].value}

            this.setVariableValues({
                ['GSname'+(args[1].value+1)] : args[0].value,
                'ActiveGlobalSnapshot': args[0].value
            })
            this.checkFeedbacks('SnapshotRecalled')
        }
        else if (address.match('GlobalSnapshots/Name')) {
            /* Global Snapshots */
            this.setVariableValues({['GSname' + (args[1].value + 1)]: args[0].value})
        }
        else if (address.match('GlobalSnapshots/Added')) {

            this.setVariableValues({
                ['GSname'+(args[1].value+1)] : args[0].value,
                'ActiveGlobalSnapshot': args[0].value
            })
            this.liveprofessorState.currentGlobalSnapshot = {id: args[1].value, name: args[0].value}
            this.checkFeedbacks('SnapshotRecalled')
        }
        else if (address.match('GlobalSnapshots/Removed')) {
            this.setVariableValues({['GSname' + (args[1].value + 1)]: 'Snap ' + args[1].value + 1})
            this.sendOscMessage('GlobalSnapshots/Refresh', [])
        }
        else if (address.match('/LiveProfessor/GlobalSnapshots/Moved')) {
            this.sendOscMessage('/GlobalSnapshots/Refresh', [])
        }
        else if (address.match('/ViewSets/Recall')) {
            /* View Sets */
            this.liveprofessorState.currentViewSetId = args[0].value+1
            this.checkFeedbacks('ViewSetRecalled')
        }
        else if (address.match('/ViewSets/Changed')) {
            this.sendOscMessage('/LiveProfessor/ViewSets/Refresh', [])
        }
        else if (address.match('/ViewSets/Update')) {
            this.setVariableValues({['ViewSetName' + (args[1].value + 1)]: args[0].value})
        }
        if (address.match('/LiveProfessor/Ping')) {
            //Get button nr:
            this.liveprofessorState.ping = !this.liveprofessorState.ping
            this.checkFeedbacks('ping')
        }
        if (address.match('/LiveProfessor/TempoChange')) {

            let tempo = args[0].value
            this.setVariableValues({'tempo': Math.round(tempo)})
            clearInterval(tempoTimer)
            const _this = this;
            tempoTimer = setInterval(function () {
                _this.tempoTimer()
            }, 60000 / tempo / 2)
        }
        /* Generic Buttons */
        if (address.match('/Companion/GenericButton')) {
            //Get button nr:
            let nr = parseInt(address.substring(32))
            this.liveprofessorState.buttons[nr] = args[0].value
            this.checkFeedbacks('GenericButton')
        } else if (address.match('/Companion/Rotary')) {
            //Get button nr:
            let nr = parseInt(address.substring(17))
            this.liveprofessorState.rotaryValues[nr-1] = args[0].value

            console.log(this.liveprofessorState.rotaryValues[nr-1])
            this.checkFeedbacks('Rotary')
        }

    }


}

runEntrypoint(LiveProfessorInstance, UpgradeScripts)

