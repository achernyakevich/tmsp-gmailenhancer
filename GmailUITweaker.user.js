// ==UserScript==
// @name         GmailEnhancer
// @namespace    https://bitbucket.org/achernyakevich/tmsp-redmineenhancer/
// @version      0.3.0
// @description  This script enhance Gmail UI and add some functionality.
// @author       Alexander Chernyakevich <tch@rambler.ru>
// @match        https://mail.google.com/mail/*
// @grant        GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const dtpHelper = new function() {
        this.osWindows = window.navigator.platform.includes("Win");
        this.getDTPDiv = () => {
            let divs = document.getElementsByClassName("Kj-JD hr");
            return ( divs.length > 0 ? divs[0] : null );
        }
        this.getContainerDiv = () => {
            return this.getDTPDiv().getElementsByClassName("hw")[0];
        }
        this.getTimeInput = () => {
            return this.getContainerDiv().getElementsByClassName("hu ks")[0];
        }
        this.buildTimeSelector = () => {
            let container = this.getContainerDiv();
            let div = document.createElement("div");
            div.className = "jo";
            container.appendChild(div);
            div = document.createElement("div");
            div.className = "kz";
            div.innerHTML =
                "<select id='dtpEnhancerSelect'>" +
                "<option value='10:30'>10:30</option>" +
                "<option value='12:30'>12:30</option>" +
                "<option value='17:00'>17:00</option>" +
                "</select>";
            container.appendChild(div);
            let select = document.getElementById("dtpEnhancerSelect");
            select.focus();
            select.addEventListener('change', (event) => {
                this.getTimeInput().value = event.target.value;
            }, true)
        }
        this.keydownEvenHandler = (event) => {
            if ( ( this.osWindows && event.altKey && event.shiftKey && ( event.key == 'B' || event.key == 'И' ) )
                || ( event.ctrlKey && event.shiftKey && ( event.key == 'B' || event.key == 'И' ) ) ) {
                if ( this.getDTPDiv() ) {
                    this.buildTimeSelector();
                }
                event.stopPropagation();
                event.preventDefault();
            }
        }
    }
    function tweakSnoozeDTP() {
        document.addEventListener('keydown', dtpHelper.keydownEvenHandler, true);
        GM_log("Snooze DTP listener added.");
    }
    GM_registerMenuCommand("Force tweaking Gmail Snooze DTP", tweakSnoozeDTP);

    function tweakStyles() {
        let sheet = document.createElement('style');
        sheet.innerHTML =
            "div.a3s {font-size: medium}\n" +
            "div.Am>div {font-size: medium}\n" +
            "div.Am {font-size: medium}";
        document.body.appendChild(sheet);
        GM_log("Mails font styles added.");
    }
    GM_registerMenuCommand("Force tweaking Gmail mails font.", tweakStyles);

    function initTweaks() {
        tweakStyles();
        tweakSnoozeDTP();
    }
    setTimeout(initTweaks, 10000);

})();
