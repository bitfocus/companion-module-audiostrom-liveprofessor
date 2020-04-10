var instance_skel = require('../../instance_skel');
var actions       = require('./actions');
var presets       = require('./presets');
var OSC           = require('osc');

var debug;
var log;
let states = {};

class instance extends instance_skel {

    constructor(system,id,config) {
        super(system,id,config)

        Object.assign(this, {...actions})
        Object.assign(this, {...presets})
        this.actions()

    }

    actions(system) {
        this.setActions(this.getActions());
    }

    config_fields() {

        return [
            {
                type:    'text',
                id:      'info',
                width:   12,
                label:   'Information',
                value:   'You need to also add the Companion Controller to LiveProfessor in the Hardware Controllers window'
            },
            {
                type:    'textinput',
                id:      'host',
                label:   'LiveProfessor IP',
                width:   6,
                default: '127.0.0.1',
                regex:   this.REGEX_IP
            },
            {
                type:    'textinput',
                id:      'port',
                label:   'LiveProfessor input port (default 8010)',
                width:   6,
                regex:   this.REGEX_PORT,
            },
            {
                type:    'textinput',
                id:      'receiveport',
                label:   'LiveProfessor output port (dfault 8011)',
                width:   6,
                regex:   this.REGEX_PORT,

            }
        ]
    }

    action(action) {
        let id = action.action;
        let cmd, arg
        let opt = action.options;

        switch (id){

            case 'globalsnapshotnr':
                arg = [ {
                    type: "i",
                    value: parseInt(opt.snapshot)-1
                }]
                cmd = '/GlobalSnapshots/Recall'
                break;

            case 'globalsnapshotname':
                arg = [ {
                    type: "s",
                    value: (opt.snapshotname)
                }]
                cmd = '/GlobalSnapshots/Recall'
                break;

            case 'recallcue':
                arg = [ {
                    type: "s",
                    value: (opt.cuenumber)
                }]
                cmd = '/Cue/Recall'
                break;

            case 'recallcuefromlist':
                arg = [ {
                    type: "s",
                    value: (opt.listnumber)
                }, {
                        type: "s",
                        value: (opt.cuenumber)
                    }]
                cmd = '/Cue/Recall/'
                break;

            case 'FireNextCue':
                arg = []
                cmd = '/Command/CueLists/FireNextCue'
                break;
            case 'StepUp':
                arg = []
                cmd = '/Command/CueLists/StepUp'
                break;
            case 'StepDown':
                arg = []
                cmd = '/Command/CueLists/StepDown'
                break;
            case 'StopAllCues':
                arg = []
                cmd = '/Command/CueLists/StopAllCues'
                break;
            case 'FirePreviousCue':
                arg = []
                cmd = '/Command/CueLists/FirePreviousCue'
                break;
            case 'Gototop':
                arg = []
                cmd = '/Command/CueLists/Gototop'
                break;

            case 'genericcommand':
                cmd = opt.command
                break;



            case 'GenericButton':

                cmd = '/LiveProfessor/GenericButtons/Button'+opt.buttonNr
                arg = [ {
                    type: "f",
                    value: 1
                }]
                break;

        }

        if (arg == null) {
            arg = [];
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
                    default: this.rgb(255, 255, 255)
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(0, 255, 0)
                },
                {
                    label: 'Button Number',
                    type: 'number',
                    id: 'buttonNr',
                    width: 64,
                    default: 1,
                    min: 1,
                    max: 24
                }
            ]
        }
        feedbacks['snapshotrecalled'] = {
            label: 'Global Snapshot Recalled',
            description: 'Use number or name depending on action',
            options: [
                {
                    type: 'colorpicker',
                    label: 'Foreground color',
                    id: 'fg',
                    default: this.rgb(0, 0, 0)
                },
                {
                    type: 'colorpicker',
                    label: 'Background color',
                    id: 'bg',
                    default: this.rgb(94, 194, 232)
                },
                {
                    label: 'Snapshot Number',
                    type: 'number',
                    id: 'snapshotnr',
                    width: 64,
                    default: 0,
                    min: 0,
                    max: 9999
                }
                ,
                {
                    label: 'Name',
                    type: 'textinput',
                    id: 'snapshotname'
                }
            ]
        }


        this.setFeedbackDefinitions(feedbacks)
    }

    //Seems to store some states
    feedback(feedback) {

        console.log("****feedback")

        if (feedback.type === 'GenericButton') {
            console.log("feedback GenericButton")
            if (states["GenericButton"+feedback.options.buttonNr] == 1) {
                return { color: feedback.options.fg, bgcolor: feedback.options.bg }
            }
        }

        if (feedback.type === 'snapshotrecalled') {


            if (states['currentGs'].id === (parseInt(feedback.options.snapshotnr)-1)) {
                console.log("feedback snapshotrecalled")
                return { color: feedback.options.fg, bgcolor: feedback.options.bg }
            } else if (states['currentGs'].name === (feedback.options.snapshotname)) {

                console.log("feedback snapshotrecalled")
                return { color: feedback.options.fg, bgcolor: feedback.options.bg }
            }
        }


       console.log(feedback)
        return {}
    }

    destroy() {
        this.status(this.STATUS_UNKNOWN,"Disabled")
        debug("destroy", this.id)
    }

    init() {
        debug = this.debug;
        log = this.log;
        if (this.config.receiveport<1) this.config.receiveport = 8011
        if (this.config.port<1) this.config.port = 8010
        this.init_osc();
        this.init_feedbacks();
        this.init_variables()
        this.status(this.STATE_OK)
        this.init_presets()
        states['currentGs']={'id':-1, 'name':''};

    }

    updateConfig(config) {

        this.config = config

        this.actions()

    }



    init_variables() {

        var variables = [];

        variables.push( { name:'NextCueName', label: 'Next cue to fire' })
        variables.push( { name:'ActiveCueName', label: 'Current cue to fire' })
        variables.push( { name:'ActiveGlobalSnapshot', label: 'Current global snapshot' })
        var i;
        for (i = 1; i < 100; i++) {
            variables.push( { name: 'GSname'+i, label: 'Global Snapshot Name '+i })
        }

        for (i = 1; i < 24; i++) {
            variables.push( { name: 'GenericButtonName'+i, label: 'Button Name Name '+i })
        }


        this.setVariableDefinitions(variables)

        for (i = 1; i < 100; i++) {
            this.setVariable('GSName' + i, "Snap " + (i + 1))
        }
    }

    connect() {
        this.status(this.STATUS_UNKNOWN, "Connecting");
    }


    init_presets() {

        this.setPresetDefinitions(this.getPresets());
    }

    init_osc() {

        if (this.connecting) {
            return;
        }

        if (this.qSocket) {
            this.qSocket.close();
        }

        if (this.config.host) {


           if (this.config.receiveport<1) this.config.receiveport = 8011
            if (this.config.port<1) this.config.port = 8010

            this.qSocket = new OSC.UDPPort({
                localAddress: "0.0.0.0",
                localPort: this.config.receiveport,
                address: this.config.host,
                port: this.config.port,
                metadata: true
            });
            this.connecting = true;

            this.qSocket.open();

            this.qSocket.on("error", (err) => {
                debug("Error", err);
                this.log('error', "Error: " + err.message);
                this.connecting = false;
                this.status(this.STATUS_ERROR, "Can't connect to LiveProfessor");
                if (err.code == "ECONNREFUSED") {
                    this.qSocket.removeAllListeners();
                }
            });

            this.qSocket.on("close", () => {
                this.log('error', "Connection to LiveProfessor Closed");
                this.connecting = false;
                this.status(this.STATUS_WARNING, "CLOSED");
            });

            this.qSocket.on("ready", () => {
                this.connecting = false;
                this.log('info',"Connected to LiveProfessor:" + this.config.host);
                this.sendOSC('/LiveProfessor/GlobalSnapshots/Refresh', [])
            });

            this.qSocket.on("message", (message) => {
                this.processMessage(message)

            });

            this.qSocket.on("data", (data) => {
                // console.log("Got: ",data, "from",this.qSocket.options.address);
            });
        }
    }

    processMessage(message) {
        console.log("Got address: ", message.address);
        console.log("Got args: ", message.args);

        let address = message.address
        let args = message.args
        let channelNumber

        if (address.match('LiveProfessor/CueLists/NextCue')) {
            this.setVariable('NextCueName', args[0].value);
        }
        if (address.match('LiveProfessor/CueLists/ActiveCue')) {
            this.setVariable('ActiveCueName', args[0].value);
        }

        if (address.match('/LiveProfessor/GlobalSnapshots/Recalled')) {

            states['currentGs']={'id':args[1].value, 'name':args[0].value};
            this.setVariable('GSname'+args[1].value+1, args[0].value);
            this.setVariable('ActiveGlobalSnapshot', args[0].value);

            this.checkFeedbacks('gsrecalled')

        }

        if (address.match('/LiveProfessor/GlobalSnapshots/Name')) {

            //states['currentGs']={'id':args[1].value, 'name':args[0].value};
            this.setVariable('GSname'+(args[1].value+1), args[0].value);
            console.log("name updated");


        }
        if (address.match('/LiveProfessor/GlobalSnapshots/Added')) {


            this.setVariable('GSname'+(args[1].value+1), args[0].value);
            console.log("Snapshot added");

        }

        if (address.match('/LiveProfessor/GlobalSnapshots/Removed')) {

            this.setVariable('GSname'+(args[1].value+1), "Snap "+args[1].value+1);
            this.sendOSC('/LiveProfessor/GlobalSnapshots/Refresh', [])
        }

        if (address.match('/LiveProfessor/GlobalSnapshots/Moved')) {

            this.sendOSC('/LiveProfessor/GlobalSnapshots/Refresh', [])
        }

        if (address.match('/LiveProfessor/GenericButton')) {

            //Get button nr:
            var nr = parseInt(address.substring(36));
            states['GenericButton'+nr]=args[0].value;
          console.log("GenericButton"+nr+": ", states['GenericButton'+nr]);
          this.checkFeedbacks('GenericButton')

        } else {
            debug(message.address, message.args);
        }

    }

    sendOSC(node, arg) {

        var host,port = "";
        if (this.config.host !== undefined && this.config.host !== ""){
            host = this.config.host;
        }
        if (this.config.port !== undefined && this.config.port !== ""){
            port = this.config.port;
        }
        this.system.emit('osc_send',host, port, node, arg)
    }

}

exports = module.exports = instance;
