// ==UserScript==
// @name         GmailEnhancer
// @namespace    https://bitbucket.org/achernyakevich/tmsp-gmailenhancer/
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
        this.getDateInput = () => {
            return this.getContainerDiv().getElementsByClassName("hu jA")[0];
        }
        this.getTimeInput = () => {
            return this.getContainerDiv().getElementsByClassName("hu ks")[0];
        }
        this.buildSnoozeSelector = () => {
            let container = this.getContainerDiv();
            let selectedDateString = this.getDateInput().value;
            let div = document.createElement("div");
            div.className = "jo";
            div.id = "snoozeSelectorGapDiv";
            container.appendChild(div);
            div = document.createElement("div");
            div.className = "kz";
            div.id = "snoozeSelectorSelectDiv";
            div.innerHTML =
                "<select id='snoozeSelectorSelect'>" +
                this.getOptionsInnerHTML(selectedDateString) +
                "</select>";
            container.appendChild(div);
            let select = document.getElementById("snoozeSelectorSelect");
            select.focus();
            select.addEventListener('change', (event) => {
                let values = event.target.value.split("|");
                this.getDateInput().value = values[0];
                this.getTimeInput().value = values[1];
            }, true)
            select.addEventListener('blur', (event) => {
                this.destroySnoozeSelector();
            }, true)
        }
        this.getOptionsInnerHTML = (dateStr) => {
            // date.toLocaleString("en-uk", {year: "numeric", month: "short", day: "numeric"})
            // date.toLocaleString("en-uk", {hour: "2-digit", minute: "2-digit" })
            return "<option value='" + dateStr + "|10:30'>10:30</option>" +
                "<option value='" + dateStr + "|12:30'>12:30</option>" +
                "<option value='" + dateStr + "|17:00'>17:00</option>";
        }
        this.destroySnoozeSelector = () => {
            let div = document.getElementById("snoozeSelectorSelectDiv");
            if ( div ) { div.remove() }
            div = document.getElementById("snoozeSelectorGapDiv");
            if ( div ) { div.remove() }
        }
        this.keydownEvenHandler = (event) => {
            if ( ( event.shiftKey
                  && ( event.altKey || event.ctrlKey )
                  && ( event.code == 'KeyB' ) ) ) {
                if ( this.getDTPDiv() ) {
                    this.buildSnoozeSelector();
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
