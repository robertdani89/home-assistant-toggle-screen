const mqtt = require('mqtt')
const { exec } = require('child_process')
const { mqttAdress } = require('./config')

const TOPIC_DISPLAY_OPEN = '/local/display_open'
const TOPIC_DISPLAY_CLOSE = '/local/display_close'

const client = mqtt.connect(mqttAdress)
const fnMap = new Map()

function registerMethodToTopic(topic, fn) {
  fnMap.set(topic, fn)
}

function displayOn(message) {
  exec("vbetool dpms on", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function displayOff(message) {
  exec("vbetool dpms off", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

registerMethodToTopic(TOPIC_DISPLAY_OPEN, displayOn)
registerMethodToTopic(TOPIC_DISPLAY_CLOSE, displayOff)

client.on('connect', function () {
  client.subscribe(Array.from(fnMap.keys()), function (err) {
    if (err) {
      console.log(err)
    }
  })
})

client.on('message', function (topic, message) {
  // console.log(topic.toString())
  // console.log(message.toString())
  fnMap.get(topic)(message)
})