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
        requestData: "{\"system\":{\"set_relay_state\":{\"state\":1}}}"
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
            username: String,
            password: String,
            result: {
                type: String,
                notify: true
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();

        this._queryPlugStatus();
    }

    _queryPlugStatus() {
        if (this.device && this.token) {
            // TODO query plug status
        }

        setTimeout(this._queryPlugStatus, 1000);
    }

    authenticate() {
        if (!this.username || !this.password)
            return;

        let req = new XMLHttpRequest();
        let self = this;
        req.open('POST', 'https://wap.tplinkcloud.com');
        req.setRequestHeader('Content-type', 'application/json');

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                self.result = JSON.stringify(JSON.parse(req.responseText), null, 4);
            }
        }

        authMessage.params.cloudUserName = this.username;
        authMessage.params.cloudPassword = this.password;
        req.send(JSON.stringify(authMessage));
    }

    getDevices() {
        if (!this.token)
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

        req.send(JSON.stringify(deviceMessage));
    }

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
        req.send(JSON.stringify(passthroughMessage));
    }
}

customElements.define('tplink-control', TplinkControl);