chaturbateDuino
===============

a userscript to make Arduino interact with Chaturbate

## Installation:

1. Install TamperMonkey for Chrome from https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. Open the script URL with Chrome: https://raw.github.com/nerdguy/chaturbateDuino/master/chaturbateduino_testbed.user.js
Chrome should ask you if you want to use the script with TamperMonkey. click 'ok'
3. Download or install the local server from https://github.com/nerdguy/httpfirmata

## Running:
1. Connect your Arduino
2. Start the [local server](https://github.com/nerdguy/httpfirmata). I prepared a self-contained Mac App so you don't have to deal with python and library dependencies. You can download it from: https://github.com/downloads/nerdguy/httpfirmata/httpfirmata_run.zip
Note: You will have to 'Force Quit' the app in order to close it.
3. when you are inside a chatroom, you should see a grey rectangle saying 'Firmata Control Panel' on the top left of the page. Click 'fetch ports'
4. a dropdown menu will replace the 'fetch ports' link. Select the port your arduino is connected to.
5. Set a Goal and hit the 'enter' key
6. when you're done, change the dropdown menu back to 'select port' to reset the board and its pins.

### Notes

1. the default handler assumes a pwm connected to pin 3.
2. Feel free to fork and modify the handler to suit your needs :)

## License

MIT License.
