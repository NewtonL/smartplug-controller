import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

let authMessage = {
    method: 'login',
    params: {
        appType: 'Kasa_Android',
        terminalUUID: '6280bbe1-d8eb-4f54-b666-19c166dd73db'
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

    authenticate() {
        let req = new XMLHttpRequest();
        let self = this;
        req.open('POST', 'https://wap.tplinkcloud.com');
        req.setRequestHeader('Content-type', 'application/json');

        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200) {
                self.result = JSON.stringify(JSON.parse(req.responseText), null, 4);
            }
        }

        if (this.username && this.password) {
            authMessage.params.cloudUserName = this.username;
            authMessage.params.cloudPassword = this.password;
            req.send(JSON.stringify(authMessage));
        }

    }
}

customElements.define('tplink-control', TplinkControl);