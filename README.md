# android-run-all

Install and run an apk on all connected Android devices.

Usage:

```
android-run-all apk activity

Options:
  -h, --help  Show help                                                [boolean]
  -w, --wake  Wake the phone using Wakeydroid          [boolean] [default: true]

Examples:
  app.js app.apk com.some.app/.Activity     Install & run app.apk on all
                                            connected devices
  app.js app.apk com.some.app/.Activity     Don't use wakey to wake the device
  --wake false
```

In order to use the waking feature, Wakey Droid is required:
https://play.google.com/store/apps/details?id=bdjnk.android.wakeydroid&hl=en
