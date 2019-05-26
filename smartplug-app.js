import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-input/paper-input.js'
import './tplink-control.js'

class SmartplugApp extends PolymerElement {
    static get is() {return 'smartplug-app';}

    static get template() {
        return html`
        <style>
            #authDiv {
                width: 50%;
                float: left;
                padding: 20px;
            }
            #resultArea {
                color: white;
                width: 40%;
                height: 500px;
                background-color: #020020;
                resize: none;
            }
            paper-button {
                background: rgb(179, 0, 149);
            }
            paper-input {
                --paper-input-container-input-color: white;
            }
        </style>
        <div id="authDiv">
            <paper-input id="usernameField" label="TP-Link Kasa Username" value="{{username}}"></paper-input>
            <paper-input id="passwordField" type="password" label="TP-Link Kasa Password" value="{{password}}"></paper-input>
            <paper-button id="authButton" on-click="_authenticateClicked" raised>Authenticate</paper-button>
            <tplink-control id="control" username="{{username}}" password="{{password}}" result="{{result}}"></tplink-control>
        </div>
        <div>
            <textarea id="resultArea" readonly>{{result}}</textarea>
        </div>
        `;
    }

    _authenticateClicked() {
        this.$.control.authenticate();
    }
}

customElements.define('smartplug-app', SmartplugApp);