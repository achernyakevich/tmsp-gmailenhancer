// ==UserScript==
// @name         GmailEnhancer
// @namespace    https://bitbucket.org/achernyakevich/tmsp-gmailenhancer/
// @version      0.3.3
// @description  This script enhance Gmail UI and add some functionality.
// @author       Alexander Chernyakevich <tch@rambler.ru>
// @match        https://mail.google.com/mail/*
// @grant        GM_log
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const GMAIL_LOCALE = document.getElementsByTagName("html")[0].getAttribute("lang");

    const dtpHelper = new function() {
        this.osWindows = window.navigator.platform.includes("Win");
        this.gmailLocale = ( GMAIL_LOCALE ? GMAIL_LOCALE : "en-uk" );
        this.relativeSnoozeConfig = {
            "15 min": 15*60*1000,
            "30 min": 30*60*1000,
            "45 min": 45*60*1000,
            "1 hour": 1*60*60*1000,
            "2 hours": 2*60*60*1000,
            "4 hours": 4*60*60*1000,
            "8 hours": 8*60*60*1000,
            "24 hours": 24*60*60*1000
        };
        this.absoluteSnoozeConfig = [{h: 10, m: 30}, {h: 12, m: 20}, {h: 17, m: 0}, {h: 18, m: 45}];
        this.getDateLocaleString = (date) => {
            return date.toLocaleString(this.gmailLocale, {year: "numeric", month: "short", day: "numeric"})
        }
        this.getTimeLocaleString = (date) => {
            return date.toLocaleString(this.gmailLocale, {hour: "2-digit", minute: "2-digit" })
        }
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
        this.buildSnoozeSelector = (relativeSnooze = false) => {
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
                this.getOptionsInnerHTML(relativeSnooze, selectedDateString) +
                "</select>";
            container.appendChild(div);
            let select = document.getElementById("snoozeSelectorSelect");
            select.focus();
            select.addEventListener('change', (event) => {
                let values = event.target.value.split("|");
                this.getDateInput().value = values[0];
                this.getTimeInput().value = values[1];
            }, true);
            select.addEventListener('blur', (event) => {
                this.destroySnoozeSelector();
            }, true);
            select.dispatchEvent(new Event('change'));
        }
        this.getOptionsInnerHTML = (relativeSnooze, dateStr) => {
            return ( relativeSnooze
                    ? this.getRelativeSnoozeOptionsInnerHTML()
                    : this.getAbsoluteSnoozeOptionsInnerHTML() );
        }
        this.getRelativeSnoozeOptionsInnerHTML = () => {
            let optionsStr = "";
            for (const item in this.relativeSnoozeConfig) {
                let snoozeTo = new Date();
                snoozeTo.setTime(snoozeTo.getTime() + this.relativeSnoozeConfig[item]);
                optionsStr += this.getSnoozeToOption(snoozeTo, item);
            }
            return optionsStr;
        }
        this.getAbsoluteSnoozeOptionsInnerHTML = () => {
            let optionsStr = "";
            let options = [];
            this.absoluteSnoozeConfig.forEach(it => {
                let prefix = "";
                let dateTime = new Date();
                dateTime.setHours(it.h);
                dateTime.setMinutes(it.m);
                if ( dateTime.getTime() < new Date().getTime() ) {
                    prefix = "Tomorrow ";
                    dateTime.setDate(dateTime.getDate()+1);
                }
                let lbl = prefix + this.getTimeLocaleString(dateTime);
                options.push({"snoozeTo": dateTime, "label": lbl});
            });
            options.sort((o1, o2) => {return o1.snoozeTo.getTime() - o2.snoozeTo.getTime()});
            options.forEach(it => {
                optionsStr += this.getSnoozeToOption(it.snoozeTo, it.label);
            });
            return optionsStr;
        }
        this.getSnoozeToOption = (snoozeTo, label) => {
            return "<option value='" +
                this.getDateLocaleString(snoozeTo) + "|" + this.getTimeLocaleString(snoozeTo) +
                "'>" + label + "</option>";
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
                    if ( event.altKey ) {
                        this.buildSnoozeSelector(true);
                    } else {
                        this.buildSnoozeSelector(false);
                    }
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
