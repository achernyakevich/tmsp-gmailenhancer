## Intro ##

The `GmailEnhancer.user.js` designed to bring additional functionality and UI
enhancements to [Gmail](https://mail.google.com/).

To install script click the following link -
[GmailEnhancer.user.js](https://bitbucket.org/achernyakevich/tmsp-gmailenhancer/raw/master/GmailEnhancer.user.js).


## Features

### Mail "Snooze until..." dialog enhancments

If you have open "Snooze until..." dialog then you can use the following
keyboard shortcuts:

* `Alt + B` (macOS - `Option + B`) - it will show selectbox to select relative
snooze options.
* `Ctrl + B` (macOS - `MacCtrl + B`) - it will show selectbox to select fixed time
snooze options.

### Gmail font size tweaking

For huge screens you could experience a problem of reading mail text because
of too small font size used. This script fix it by using bigger font as
default. It is available not only in mail reading pane but in mail writing
too (though mail will be sent using default Gmail styles).

As a side effect you could see in received mail interesting things like what
part of the text was copy-pasted and what was hand-typed. :)


## Contribution guidelines ##

If you would like to contribute - create a pull request.

If you need some features or would like to propose some features - create
an issue.

## Release Notes ##

## v. 0.3.3 ##

### Enhancements ###

* Gmail locale detection added. Now script works for any UI language.

## v. 0.3.2 ##

### Fixes ###

* Initiation of snooze Date/Time set first selected option's date/time
automatically without changing selection

## v. 0.3.1 ##

### Features ###

* Possibility to set snooze Date/Time by predefined delay for Snooze popup
* Possibility to set snooze Date/Time for predefined time for Snooze popup

## v. 0.3.0 ##

### Misc ###

* Renaming (GmailUITweaker -> GmailEnhancer)

## v. 0.2.3 ##

### Misc ###

* Migrated to new public repository
* Added metainformation for supporting automatic updates and public activities

## v. 0.2.2 and earlier ##

### Features ###

* Predefined time selector for Snooze popup
* Increasing size of default font (mail view and editing)
