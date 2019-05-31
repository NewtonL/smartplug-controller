import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

let authMessage = {
    method: 'login',
    params: {
        appType: 'Kasa_Android',
        terminalUUID: '6280bbe1-d8eb-4f54-b666-19c166dd73db'
    }
};

let deviceMessage = {
    method: 'getDeviceList'
};

let passthroughMessage = {
    method: 'passthrough',
    params: {
    }
};

let statusMessage = {
    method: 'passthrough',
    params: {
        requestData: JSON.stringify({
            system: {
                get_sysinfo: null
            },
            emeter: {
                get_realtime: null
            }
        })
    }
};

class TplinkControl extends PolymerElement {
    static get is() {return 'tplink-control';}

    static get template() {
        return html`
        `;
    }

    static get properties() {
        return {
            /**
             * TP-Link Kasa username
             */
            username: String,
            
            /**
             * TP-Link Kasa password
             */
            password: String,

            /**
             * Unique user token
             */
            token: {
                type: String,
                notify: true
            },

            /**
             * Unique device ID corresponding to smart plug
             */
            device: {
                type: String,
                notify: true
            },

            /**
             * Response returned from TP-Link API
             */
            result: {
                type: String,
                notify: true
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.queryPlugStatus();
    }


    /**
     * Authenticates using username and password
     * Returns token
     */
    authenticate() {
        if (!this.username || !this.password)
            return;

        let req = new XMLHttpRequest();
        let self = this;
        req.open('POST', 'https://wap.tplinkcloud.com');
        req.setRequestHeader('Content-type', 'application/json');

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                let response = JSON.parse(req.responseText);
                if (response && response.result && response.result.token)
                    self.token = response.result.token;
                self.result = JSON.stringify(response, null, 4);
            }
        }

        authMessage.params.cloudUserName = this.username;
        authMessage.params.cloudPassword = this.password;
        req.send(JSON.stringify(authMessage));
    }

    /**
     * Gets a list of TP-Link devices registered to the user
     */
    getDevices() {
        if (!this.token)
            return;

        let req = new XMLHttpRequest();
        let self = this;
        req.open('POST', 'https://wap.tplinkcloud.com?token=' + this.token);
        req.setRequestHeader('Content-type', 'application/json');

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                let response = JSON.parse(req.responseText);
                if (response && response.result && response.result.deviceList) {
                    let devices = response.result.deviceList;
                    if (devices.length > 0)
                        self.device = devices[0].deviceId;
                }
                self.result = JSON.stringify(response, null, 4);
            }
        }

        req.send(JSON.stringify(deviceMessage));
    }

    /**
     * Sends command to toggle the smart plug's power
     */
    togglePlug() {
        if (!this.device || !this.token)
            return;

        let req = new XMLHttpRequest();
        let self = this;
        req.open('POST', 'https://wap.tplinkcloud.com?token=' + this.token);
        req.setRequestHeader('Content-type', 'application/json');

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                self.result = JSON.stringify(JSON.parse(req.responseText), null, 4);
            }
        }

        passthroughMessage.params.deviceId = this.device;
        passthroughMessage.params.requestData = JSON.stringify({
            system: {
                set_relay_state: {
                    state: this.status ? 1 : 0
                }
            }
        });
        this.status = !this.status;
        req.send(JSON.stringify(passthroughMessage));
    }

    /**
     * Get the current plug status (on/off)
     */
    queryPlugStatus() {
        if (this.device && this.token) {
            let req = new XMLHttpRequest();
            let self = this;
            req.open('POST', 'https://wap.tplinkcloud.com?token=' + this.token);
            req.setRequestHeader('Content-type', 'application/json');
    
            req.onreadystatechange = function() {
                if(req.readyState == 4 && req.status == 200) {
                    let response = JSON.parse(req.responseText);
                    if (response && response.result && response.result.responseData) {
                        let responseData = JSON.parse(response.result.responseData);
                        if (responseData && responseData.system && responseData.system.get_sysinfo) {
                            let sysInfo = responseData.system.get_sysinfo;
                            console.log(sysInfo.relay_state ? "on" : "off");
                        }
                    }
                }
            }
    
            statusMessage.params.deviceId = this.device;
            req.send(JSON.stringify(statusMessage));
        }

        setTimeout(this.queryPlugStatus.bind(this), 1000);
    };
}

customElements.define('tplink-control', TplinkControl);