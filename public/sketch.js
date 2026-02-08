
const socket = io();
var hmap = {
  w:40,
  h:40,
  map: [],
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
      fill(floor(hmap.map[i][j].y) % 255);
      if(hmap.map[i][j] > 255) {
        console.log(hmap.map[i][j]);
      }
      rect(i * cellW, j * cellH, cellW, cellH);
    }
  }
}
