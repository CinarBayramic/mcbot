
const socket = io();
var hmap = {
  w:40,
  h:40,
  bot:null,
  map: [],
  entities: []
};

socket.on('map', (heightmap) => {
hmap = heightmap;
});

function setup() {
  createCanvas(400, 400);
  hmap.w = 40;
  hmap.h = 40;
  for(let i = 0; i < hmap.w; i++) {
    hmap.map[i] = [];
   for(let j = 0; j < hmap.h; j++) {
    hmap.map[i][j] = {y: random(100,255)};
   } 
  }
}

function draw() {
  background(220);

  let cellW = width / hmap.w;
  let cellH = height / hmap.h;

  for (let i = 0; i < hmap.w; i++) {
    for (let j = 0; j < hmap.h; j++) {
      fill(floor(hmap.map[i][j].y) % 256);
      if(hmap.map[i][j] > 255) {
        console.log(hmap.map[i][j]);
      }
      rect(i * cellW, j * cellH, cellW, cellH);
    }
  }
  fill(255,0,0);
  if(hmap.bot !== null) {
  let b = hmap.bot;
  
    for(let i = 0; i < hmap.entities.length; i++) {
      let e = hmap.entities[i];
      let x = (e.position.x - b.x)  + width/2;
      let z = (e.position.z - b.z)  + height/2;
      //console.log(z)
      ellipse(x, z, 5, 5);

    }
  }
  if(mouseX < 400 & mouseY < 400) {
    fill(0,255,255)
    let a = hmap.map[floor(mouseX / cellW)][floor(mouseY / cellH)];
    console.log(JSON.stringify(a, null, 2))
    text(JSON.stringify(a,null,2),mouseX,mouseY)
  }
}
