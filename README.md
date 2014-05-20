# How to use
## Arduino
First, fire up the Arduino IDE, load the provided .ino file and burn the sketch to an Uno (or other, IDE-compatible) board.
Hardware-wise, you will need an analog thermometer (tested with an MCP9700A) hooked up to Analog Input 0.

## Node.js
Ensure that all the required modules are installed (this is going to be easier when a package.json is provided):
```
npm install socket.io serialport
```

Next, launch the provided server:
```
node daemon.js
```

Finally, if everything went right, you should be able to navigate to the Web interface and see the real-time results:
```
http://localhost:1337/client.html
```

Enjoy!
