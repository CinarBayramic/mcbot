const mineflayer = require('mineflayer')
const Vec3 = require('vec3');

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);


app.use(express.static('public'))
io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(8000, () => {
  console.log('server running at http://localhost:8000');
});
const bot = mineflayer.createBot({
  host: 'test3225.aternos.me',// test3225.aternos.me | 127.0.0.1
  port: 25565,
  username: 'bot',
  logErrors:false
})
async function mapSurroundings(w,h) {
  let wr = w/2;
  let hr = h/2;
  let hmap = []
  min = 500;
  max = 0;
  for(let dx = 0;dx < w; dx++) {
    hmap[dx] = [];
    for(let dz = 0;dz < h; dz++) {
      var found = false;
      const minY = bot.world.minY;
      const maxY = bot.world.maxY;

      for(let i = bot.entity.position.y + 20; i >= -60 ;i--) {
        let x = bot.entity.position.x - wr + dx;
        let z = bot.entity.position.z - hr + dz;
        let bpos = new Vec3(x,i,z)
        let block = bot.blockAt(bpos);
        if(block === null) {
        // console.log(i)
          break;
        }
        if(block.type !== bot.registry.blocksByName.air.id) {
          found = true;
          if(i > max) {
            max = i;
          }
          if(i < min) {
            min = i;
          }
          hmap[dx][dz] = {
            y:0.5,
            type:block.name,
            h:i
          };
          break;
        }
      }
      if(!found) {
          hmap[dx][dz] = {
            y:0,
            type:"not loaded / unknown",
            h:0
          };
      }
    }
  }
  console.log("a")
  for(let dx = 0;dx < w; dx++) {
    for(let dz = 0;dz < h; dz++) {
      hmap[dx][dz].y = (hmap[dx][dz].h - min) / (max - min) * 255;
    }
  }
  io.emit("map", {
      w:w,
      h:h,
      map: hmap,
      bot:bot.entity.position,
      entities: Object.values(bot.entities).map(e=>({name:e.name,position:e.position,kind:e.kind})).filter(e => e.kind === "player")
  })
}
bot.once("spawn", ()=> {
  var fsm = {
    currentstate: "none",
    stateLambdas: new Map(),
    addState: function(state, f) {
    fsm.stateLambdas.set(state,f);
    },
    runState: function(state) {
    fsm.stateLambdas.get(state)();
    }
  };
  
  let lastEmit = 0;
  fsm.addState("patrol", ()=> {
    if (Date.now() - lastEmit > 100) { // every 2 seconds
    mapSurroundings(30, 30);
    lastEmit = Date.now();
    }
    bot.setControlState("forward",true);
  })
  fsm.currentstate = "patrol"
  bot.on("physicsTick", ()=> {
    fsm.runState(fsm.currentstate)
  })
})