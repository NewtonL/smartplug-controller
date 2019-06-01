import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-toggle-button/paper-toggle-button.js'
import './tplink-control.js'

class SmartplugApp extends PolymerElement {
    static get is() {return 'smartplug-app';}

    static get template() {
        return html`
        <style>
            #formDiv {
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
            paper-toggle-button {
                --paper-toggle-button-unchecked-bar-color: white;
            }
        </style>
        <div id="formDiv">
            <paper-input id="usernameField" label="TP-Link Kasa Username" value="{{username}}"></paper-input>
            <paper-input id="passwordField" type="password" label="TP-Link Kasa Password" value="{{password}}"></paper-input>
            <paper-button id="authButton" on-click="_authenticateClicked" raised>Authenticate</paper-button>
            
            <paper-input id="tokenField" label="Token (get this from authentication output)" value="{{token}}"></paper-input>
            <paper-button id="deviceButton" on-click="_deviceClicked" raised>Get Devices</paper-button>

            <paper-input id="deviceField" label="Device ID (get this from device output)" value="{{device}}"></paper-input>
            <br>Toggle Plug Power
            <paper-toggle-button id="switchToggle" on-change="_toggleChanged" checked="{{plugOn}}"></paper-toggle-button>
            <br>Plug On Time: {{onTime}}
            <paper-input id="timerInput" label="Turn off plug after X seconds" value="{{timer}}"></paper-input>
        </div>
        <div>
            <textarea id="resultArea" readonly>{{result}}</textarea>
        </div>

        <tplink-control id="control" username="{{username}}" password="{{password}}" token="{{token}}" 
            device="{{device}}" status="{{plugOn}}" result="{{result}}" on-time="{{onTime}}"
            timer="{{timer}}"></tplink-control>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.plugOn = false;
    }

    _authenticateClicked() {
        this.$.control.authenticate();
    }

    _deviceClicked() {
        this.$.control.getDevices();
    }

    _toggleChanged() {
        this.$.control.togglePlug();
    }
}

customElements.define('smartplug-app', SmartplugApp);