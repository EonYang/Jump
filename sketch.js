//PLEASE RUN IT IN FULL SCREEN

var imNotGod;
var partyOrDie;
var useOnlineData = 1;
var bgColor;
var isGoingUp = 1;
var percentChange = 0;
var ndx;
var gravity = 0.8;
var url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NDX&interval=1min&apikey=CBWCNIM5UZXM6GDB&datatype=csv";

var tableNew;

var bankers = [];
var bankerCount = 0;
var building;

var bullDoze;

var screams = [];

function preload(){
  soundFormats('mp3');
  for (var i = 0; i < 12; i++) {
    screams.push(loadSound('assets/Screams/Scream'+i+'.mp3'));
  }
  // gunSound = loadSound('./assets/GunSound.mp3');
  partySound = loadSound('./assets/PartySong.mp3');
  neckSnap = loadSound('./assets/neckSnap.mp3');
  body1 = loadImage('./assets/body1.png');
  body3 = loadImage('./assets/body3.png');
  head1 = loadImage('./assets/head1.png');
  head3 = loadImage('./assets/head3.png');
  bullDozeImg = loadImage('./assets/bullDoze.png');

  road = loadImage('./assets/road.png');
  bank = loadImage('./assets/bank.png');

  tableNew = loadTable(url, "csv", "header");
}

function setup(){
  ndx = new NASDAQ();
  bullDoze = new BullDoze(windowWidth + 100, (windowHeight - 180), 250);
  // NewTableToObject();
  imageMode(CENTER);
  RadioImNotGod();
  PriceController();
  colorMode(HSB,360,100,100,100);
  rectMode(CENTER);
  createCanvas(windowWidth,windowHeight);

  bgColor = color(225, 80,30,100);
  frameRate(30);
  textAlign(CENTER);

  PartyOrDie();
  building = new Building();


}

function draw(){
  if (frameCount % 30 == 0) {
    console.log(bankers.length);
  }
  GodMode();
  background(bgColor);
  building.show();
  ndx.showText();
  bullDoze.show();
  PartyOrDie();
  if (isGoingUp == 0 && frameCount % 90 < 1 && bankers.length < 30) {
    bankers.push(new Banker(random(220,380),height - 700,random(-80,80),random(0,10)));
  }

  for (var i = 0; i < bankers.length; i++) {
    bankers[i].show();
    if (bankers[i].x < -200){
      bankers.splice(i,1);
    }
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function RefreshTable(){
  if (frameCount % 1800 == 100) {
    tableNew = loadTable(url, "csv", "header", GetNewNumbers);
  }
}

function NewTableToObject(){
  ndx.table = tableNew;
}

class NASDAQ {
  constructor() {
    this.table = tableNew;
    this.numberShown;
    this.newNumber;
    this.oldNumber;
    this.timeOfData;
    this.percentChange;
  }

  refreshNumbers() {
    this.newNumber = Number(this.table.getString(0, 'close'));
    this.oldNumber = Number(this.table.getString(1, 'close'));
    this.timeOfData = this.table.getString(0, 'timestamp');
    // print("NDX Refreshed");
  }

  showText() {
    if (useOnlineData) {
      this.numberShown = this.newNumber;
      this.percentChange = Math.round(((this.numberShown - this.oldNumber) / this.oldNumber) * 100 * 1000.0) / 100;
    } else {
      let ndxGod = priceSlider.value();
      this.percentChange = ndxGod * 10;
      this.numberShown = this.oldNumber + (this.oldNumber * this.percentChange / 1000);
    }

    this.refreshNumbers();
    fill(255);
    textSize(12);
    text("Refreshed: " + this.timeOfData, windowWidth * 3 / 4, 20);
    textSize(24);
    let ndxText = Math.round(this.numberShown * 100.0) / 100.0;

    let percentChangeText;
    if (this.percentChange < 0) {
      isGoingUp = 0;
      percentChangeText = " ↓ " + "" + this.percentChange + "‰";
    } else {
      isGoingUp = 1;
      percentChangeText = " ↑ " + "+" + this.percentChange + "‰";
    }

    text("NASDAQ: " + ndxText + "            Change: " + percentChangeText, windowWidth * 3 / 4, 120);
    textSize(36);
    text(partyOrDie, windowWidth * 3 / 4, 240);
    textSize(18)
    textAlign(CENTER);
    text(godMessage, windowWidth * 3 / 4, windowHeight - 300, );
  }
}


class Building {
  constructor() {
    this.color = color(20, 10, 95, 100);
  }

  show() {
    push();
    translate(200, height - 700);
    imageMode(CORNER);
    rectMode(CORNER);
    if (isGoingUp == 1) {
      if (frameCount % 10 == 0) {
        this.color = color(random(360), 50, 80, 100);
      }
      fill(this.color);
      rect(20, 20, 136, 416);
    }
    else {
      fill(color(0,80,20,100));
      rect(20, 20, 136, 416);
    }
    image(bank, 0, 0, 176, 456);
    image(road, -300, 456, width + 500, 150);
    pop();
  }
}

class Banker {
  constructor(x, y, deadline, angle) {
    this.x = x;
    this.y = y;
    this.phrase = 1;
    this.scale = 0.01;
    this.speed = -4;
    this.headx = 0;
    this.heady = -320;
    this.heads = -10;
    this.headFric = 0.5;
    this.blood = 1;
    this.deadline = deadline;
    this.angle = angle;
  }

  show() {
    push();
    translate(this.x, this.y);
    // console.log(this.x);
    scale(this.scale);
    if (this.phrase == 1) {
      this.p1();
    } else if (this.phrase == 2) {
      this.p2();
    } else if (this.phrase == 3) {
      this.p3();
    }
    pop();
    this.closer();
    this.drop();
  }
  closer() {
    if (this.phrase == 1) {
      this.scale += 0.001;
      this.y -= 0.4;
      this.y += sin(frameCount);
      if (this.scale >= 0.1) {
        if (this.phrase == 1) {
          screams[floor(random(screams.length))].setVolume(0.3);
          screams[floor(random(screams.length))].play();
        }
        this.phrase = 2;
      }
    }
  }

  drop() {
    if (this.phrase == 2) {


      this.y += this.speed;
      this.speed += gravity;
    }
    if (this.y >= (height - 180 + this.deadline)) {
      // scream2.stop();
      if (this.phrase == 2 && neckSnap.isPlaying() != 1) {
        neckSnap.setVolume(0.5);
        neckSnap.play();
      }
      this.phrase = 3;
    }
  }

  p1() {
    image(head1, 0, -210, );
    image(body1, 0, 110, );
  }
  p2() {

    image(head1, 0, -210, );
    image(body1, 0, 110, );
  }
  p3() {
    push();
    fill(color(0, 89, 75, 100));
    ellipse(0, 0, this.blood * 2, this.blood);
    rotate(PI * this.angle);
    image(body3, 0, 110, );
    rotate(PI / this.angle);
    image(head3, this.headx, this.heady, );
    pop();
    this.heady += this.heads;
    if (this.heads < 0) {
      this.heads += this.headFric;
    }

    if (this.blood < 300) {
      this.blood += 5;
    }

    if(this.x > bullDoze.x && (this.x - bullDoze.x) < 20)
    this.x = bullDoze.x;
  }
}

function PartyOrDie() {
  if (isGoingUp == 1) {
    bgColor = color(225, 80, 30, 100);
    partyOrDie = "STOCKS ARE GOING UP! \n LET'S PARTY!"
    if (partySound.isPlaying() != 1) {
      partySound.setVolume(0.5);
      partySound.play();
    }
  } else {
    bgColor = color(00, 80, 90, 100);
    partyOrDie = "STOCKS ARE GONNA CRASH! OH NO!! \n I LOST MY WILL TO LIVE!!"
    partySound.pause();
  }
}

function GodMode() {
  if (imNotGod.value() == 1) {
    priceSlider.hide();
    useOnlineData = 1;
    godMessage = "Using Realtime Stock Data.";
  }
  if (imNotGod.value() == 0) {
    priceSlider.show();
    useOnlineData = 0;
    godMessage = "You are the GOD! \n By the SLIDER you can control the stock market!";
  }
}

class BullDoze {
  constructor(x,y,size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = - 1;
  }
  show (){
    if (bankers.length > 0){
      imageMode(CENTER);
      image(bullDozeImg, this.x+this.size/3, this.y,this.size,this.size);
      this.x+= this.speed;
      if (this.x < - 300){
        this.x = width + this.size;
      }
    }
  }
}

function RadioImNotGod() {
  imNotGod = createRadio();
  imNotGod.option("I'm the God. \n", 0);
  imNotGod.option("No I'm not.", 1);
  imNotGod.value(1);
  imNotGod.style('width', '200px');
  imNotGod.style('color', '#ffffff')
  imNotGod.style('font-size', '24px')
  imNotGod.style('text-align', 'left');
  imNotGod.position(windowWidth * 3 / 4 - 80, 360);
}

var priceSlider;
function PriceController(){
  priceSlider = createSlider(-100,100,0,1);
  priceSlider.position(windowWidth*3/4+130, 370);
  priceSlider.style('width','120px');
}