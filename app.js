#!/bin/env node

const co = require('co'),
      each = require('co-foreach'),
      sleep = require('co-sleep'),
      adb = require('adbkit'),
      yargs = require('yargs')

function* startActivity(client, id, activity) {
    console.log(`am start -a android.intent.action.MAIN -n ${activity}`)
    yield client.shell(id, `am start -a android.intent.action.MAIN -n ${activity}`)
}

function* installOnAllDevices(apk, activity, wake) {
    const client = adb.createClient()
    const devices = yield client.listDevices()
    console.log(`Found ${devices.length} Android devices`)

    each(devices, function* (device) {
        function* _startActivity(activity) { return yield startActivity(client, device.id, activity) }

        if (device.type === 'offline') return console.log(`${device.id} is offline.`)

        console.log(`[${device.id}] Installing apk`)
        yield client.install(device.id, apk)

        if (wake) {
            console.log(`[${device.id}] Waking phone`)
            yield _startActivity('bdjnk.android.wakeydroid/.Wakey')
            // wait a second to let Wakey do it's thing
            yield sleep(1000)
        }

        console.log(`[${device.id}] Starting app`)
        yield _startActivity(activity)

	//client.shell(device.id, 'am start -a android.intent.action.MAIN -n com.happybearstudios.lifquiz/com.ansca.corona.CoronaActivity')
        console.log(`[${device.id}] App is running`)
    })
}

co(function* () {
    const argv = yargs
        .usage('$0 apk activity')
        .help('h')
        .alias('h', 'help')
        .boolean('w')
        .default('w', true)
        .describe('w', 'Wake the phone using Wakeydroid')
        .alias('w', 'wake')
        .demand(2)
        .example('$0 app.apk com.some.app/.Activity', 'Install & run app.apk on all connected devices')
        .example('$0 app.apk com.some.app/.Activity --wake false', 'Don\'t use wakey to wake the device')
        .argv




    yield installOnAllDevices(argv._[0], argv._[1], argv.wake)
}).catch(function (err) {
    console.error(err.stack)
})

