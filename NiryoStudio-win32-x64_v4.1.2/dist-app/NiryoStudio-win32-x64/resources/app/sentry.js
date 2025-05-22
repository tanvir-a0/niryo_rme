const electron = require('electron')

if ((electron.app && !electron.app.isPackaged) // If main thread
        || (electron.remote && electron.remote.app && !electron.remote.app.isPackaged)) // If renderer thread
{
    const sentry = require("@sentry/electron")

    const CaptureConsole = require('@sentry/integrations').CaptureConsole

    sentry.init({
        dsn: "http://f701181d0d6e480698a0c603dd16edb4@192.168.1.114:9000/2",
        debug: true,
        integrations: [
            new CaptureConsole({
            })
          ],
    });
}