import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

class TplinkControl extends PolymerElement {
    static get is() {return 'tplink-control';}

    static get template() {
        return html`
        `;
    }
}

customElements.define('tplink-control', TplinkControl);