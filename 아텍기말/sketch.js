let scene = 0;

let startImg;
let startHoverImg;
let shopImg;
let clothesImg;
let fourthImg;

let buttonImg;
let buttonHoverImg;

// 첫 번째 옷 뱀 게임
let itemImg;
let gameBgImg; 
let snake = [];
let snakeDir;
let item;

let gridSize = 70;
let gameSpeed = 8;
let score = 0;
let targetScore = 14;
let gameOver = false;
let gameClear = false;

// 세 번째 옷 얼음 깨기 게임
let blueJacketImg;

let iceClickCount = 0;
let iceTargetClicks = 30;
let iceStartTime;
let iceTimeLimit = 15;

let iceGameOver = false;
let iceGameClear = false;

function preload() {
  startImg = loadImage("assets/시작화면 1.png");
  startHoverImg = loadImage("assets/시작화면 2.png");
  shopImg = loadImage("assets/두번째 화면.png");
  clothesImg = loadImage("assets/세번째 화면.png");
  fourthImg = loadImage("assets/네번째 화면.png");

  buttonImg = loadImage("assets/버튼 1.png");
  buttonHoverImg = loadImage("assets/버튼 2.png");

  itemImg = loadImage("assets/초록패딩.png");
  blueJacketImg = loadImage("assets/파란자켓.png");

  gameBgImg = loadImage("assets/뱀게임 배경화면.png"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  resetSnakeGame();
}

function draw() {
  imageMode(CORNER);
  rectMode(CORNER);

  if (scene == 0) {
    if (isStartHover()) {
      image(startHoverImg, 0, 0, width, height);
    } else {
      image(startImg, 0, 0, width, height);
    }
  }

  else if (scene == 1) {
    image(shopImg, 0, 0, width, height);

    fill(255);
    stroke(0);
    strokeWeight(5);
    textSize(40);
    text("ENTER 키를 누르세요", width / 2, height * 0.92);
  }

  else if (scene == 2) {
    image(clothesImg, 0, 0, width, height);
    drawButtons();
  }

  else if (scene == 3) {
    runSnakeGame();
  }

  else if (scene == 4) {
    runIceGame();
  }

  else if (scene == 5) {
    imageMode(CORNER);
    image(fourthImg, 0, 0, width, height);
    drawFourthButtons();
  }
}

function isStartHover() {
  return (
    mouseX > width * 0.25 &&
    mouseX < width * 0.75 &&
    mouseY > height * 0.02 &&
    mouseY < height * 0.32
  );
}

function getButtonRect(index) {
  let btnW = width * 0.12;
  let btnH = btnW * 0.38;
  let btnY = height * 0.78;
  let buttonCenterX = [width * 0.22, width * 0.51, width * 0.80];

  let x = buttonCenterX[index] - btnW / 2;
  return { x: x, y: btnY, w: btnW, h: btnH };
}

function drawButtons() {
  for (let i = 0; i < 3; i++) {
    let rect = getButtonRect(i);

    let isHover =
      mouseX > rect.x &&
      mouseX < rect.x + rect.w &&
      mouseY > rect.y &&
      mouseY < rect.y + rect.h;

    if (isHover) {
      image(buttonHoverImg, rect.x, rect.y, rect.w, rect.h);
    } else {
      image(buttonImg, rect.x, rect.y, rect.w, rect.h);
    }
  }
}

function drawFourthButtons() {
  for (let i = 0; i < 3; i++) {
    let rect = getButtonRect(i);

    let isHover =
      mouseX > rect.x &&
      mouseX < rect.x + rect.w &&
      mouseY > rect.y &&
      mouseY < rect.y + rect.h;

    if (isHover) {
      image(buttonHoverImg, rect.x, rect.y, rect.w, rect.h);
    } else {
      image(buttonImg, rect.x, rect.y, rect.w, rect.h);
    }
  }
}

// ===============================
// 첫 번째 옷: 뱀 게임
// ===============================

function resetSnakeGame() {
  snake = [
    { x: 5 * gridSize, y: 5 * gridSize },
    { x: 4 * gridSize, y: 5 * gridSize },
    { x: 3 * gridSize, y: 5 * gridSize }
  ];

  snakeDir = createVector(gridSize, 0);

  score = 0;
  gameOver = false;
  gameClear = false;

  spawnItem();
}

function spawnItem() {
  let cols = floor(width / gridSize);
  let rows = floor(height / gridSize);

  let newItem;
  let isOnSnake = true;

  while (isOnSnake) {
    newItem = createVector(
      floor(random(1, cols - 1)) * gridSize,
      floor(random(1, rows - 1)) * gridSize
    );

    isOnSnake = false;

    for (let segment of snake) {
      if (newItem.x === segment.x && newItem.y === segment.y) {
        isOnSnake = true;
        break;
      }
    }
  }

  item = newItem;
}

function runSnakeGame() {
  imageMode(CORNER);
  image(gameBgImg, 0, 0, width, height); 

  if (!gameOver) {
    if (frameCount % gameSpeed === 0) {
      let head = snake[0];

      let newHead = {
        x: head.x + snakeDir.x,
        y: head.y + snakeDir.y
      };

      if (
        newHead.x < 0 ||
        newHead.x >= width ||
        newHead.y < 0 ||
        newHead.y >= height
      ) {
        gameOver = true;
      }

      for (let segment of snake) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
          gameOver = true;
        }
      }

      if (!gameOver) {
        snake.unshift(newHead);

        if (newHead.x === item.x && newHead.y === item.y) {
          score++;

          if (score >= targetScore) {
            gameOver = true;
            gameClear = true;
          } else {
            spawnItem();
          }
        } else {
          snake.pop();
        }
      }
    }
  }

  for (let i = 0; i < snake.length; i++) {
    fill(i === 0 ? "#4CAF50" : "#81C784");
    stroke(30);
    rect(snake[i].x, snake[i].y, gridSize, gridSize, 8);
  }

  imageMode(CORNER);
  image(itemImg, item.x, item.y, gridSize, gridSize);

  fill(255, 0, 0);
  noStroke();
  textSize(28);
  textAlign(LEFT, TOP);
  text("옷 조각: " + score + " / " + targetScore, 20, 20);

  if (gameOver) {
    rectMode(CORNER);
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(55);

    if (gameClear) {
      text("CLEAR!", width / 2, height / 2 - 40);
      textSize(28);
      text("옷 조각 14개를 다 획득해서 옷을 얻었습니다!", width / 2, height / 2 + 20);

      textSize(26);
      text("다음 화면으로 넘어가시오", width / 2, height / 2 + 80);
      text("ENTER 키를 누르시오", width / 2, height / 2 + 115);
    } else {
      text("GAME OVER", width / 2, height / 2 - 40);
    }

    textSize(24);
    text("다시 시작하려면 R키를 누르세요", width / 2, height / 2 + 160);
    text("옷 선택 화면으로 돌아가려면 ESC키를 누르세요", width / 2, height / 2 + 200);
  }
}

// ===============================
// 세 번째 옷: 얼음 깨기 게임
// ===============================

function resetIceGame() {
  iceClickCount = 0;
  iceStartTime = millis();

  iceGameOver = false;
  iceGameClear = false;
}

function runIceGame() {
  background("#8ED6FF");

  let timeLeft = iceTimeLimit - floor((millis() - iceStartTime) / 1000);

  if (timeLeft < 0) {
    timeLeft = 0;
  }

  if (timeLeft <= 0 && !iceGameClear) {
    iceGameOver = true;
  }

  fill(255);
  stroke(0);
  strokeWeight(4);
  textAlign(CENTER, CENTER);

  textSize(40);
  text("얼음을 클릭해서 옷을 구출하세요!", width / 2, 70);

  textSize(28);
  text("클릭 횟수 : " + iceClickCount + " / " + iceTargetClicks, width / 2, 130);
  text("남은 시간 : " + timeLeft + "초", width / 2, 180);

  let iceX = width / 2;
  let iceY = height / 2 + 60;
  let iceSize = 360;

  rectMode(CENTER);
  fill(180, 230, 255, 210);
  stroke(255);
  strokeWeight(8);
  rect(iceX, iceY, iceSize, iceSize, 35);

  imageMode(CENTER);
  image(blueJacketImg, iceX, iceY, 260, 260);

  fill(180, 230, 255, 90);
  stroke(220, 250, 255);
  strokeWeight(4);
  rect(iceX, iceY, iceSize, iceSize, 35);

  stroke(255);
  strokeWeight(3);

  let crackCount = floor(map(iceClickCount, 0, iceTargetClicks, 0, 12));

  for (let i = 0; i < crackCount; i++) {
    let startX = iceX + random(-150, 150);
    let startY = iceY + random(-150, 150);

    line(startX, startY, startX + random(-60, 60), startY + random(-60, 60));
    line(startX, startY, startX + random(-40, 40), startY + random(-40, 40));
  }

  rectMode(CORNER);
  noStroke();
  fill(255);
  rect(width / 2 - 200, height - 90, 400, 30, 15);

  fill(80, 180, 255);
  let barW = map(iceClickCount, 0, iceTargetClicks, 0, 400);
  rect(width / 2 - 200, height - 90, barW, 30, 15);

  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(24);
  text("얼음 깨짐 정도", width / 2, height - 120);

  if (iceGameClear) {
    rectMode(CORNER);
    fill(0, 0, 0, 170);
    rect(0, 0, width, height);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);

    textSize(60);
    text("CLEAR!", width / 2, height / 2 - 40);

    textSize(30);
    text("얼음을 깨고 옷을 획득했습니다!", width / 2, height / 2 + 30);

    textSize(26);
    text("다음 화면으로 넘어가시오", width / 2, height / 2 + 90);
    text("ENTER 키를 누르시오", width / 2, height / 2 + 125);

    textSize(24);
    text("R키 : 다시하기", width / 2, height / 2 + 170);
    text("ESC키 : 옷 선택 화면", width / 2, height / 2 + 210);
  }

  else if (iceGameOver) {
    rectMode(CORNER);
    fill(0, 0, 0, 170);
    rect(0, 0, width, height);

    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);

    textSize(60);
    text("FAIL", width / 2, height / 2 - 40);

    textSize(30);
    text("시간 안에 얼음을 깨지 못했습니다", width / 2, height / 2 + 30);

    textSize(24);
    text("R키 : 다시하기", width / 2, height / 2 + 100);
    text("ESC키 : 옷 선택 화면", width / 2, height / 2 + 140);
  }
}

// ===============================
// 마우스 입력
// ===============================

function mousePressed() {
  if (scene == 0) {
    if (isStartHover()) {
      scene = 1;
    }
  }

  else if (scene == 2) {
    let btn0 = getButtonRect(0);
    let btn2 = getButtonRect(2);

    if (
      mouseX > btn0.x &&
      mouseX < btn0.x + btn0.w &&
      mouseY > btn0.y &&
      mouseY < btn0.y + btn0.h
    ) {
      resetSnakeGame();
      scene = 3;
    }

    else if (
      mouseX > btn2.x &&
      mouseX < btn2.x + btn2.w &&
      mouseY > btn2.y &&
      mouseY < btn2.y + btn2.h
    ) {
      resetIceGame();
      scene = 4;
    }
  }

  else if (scene == 4) {
    if (!iceGameOver && !iceGameClear) {
      let iceX = width / 2;
      let iceY = height / 2 + 60;
      let iceSize = 360;

      if (
        mouseX > iceX - iceSize / 2 &&
        mouseX < iceX + iceSize / 2 &&
        mouseY > iceY - iceSize / 2 &&
        mouseY < iceY + iceSize / 2
      ) {
        iceClickCount++;

        if (iceClickCount >= iceTargetClicks) {
          iceGameClear = true;
        }
      }
    }
  }

  else if (scene == 5) {
    let btn0 = getButtonRect(0);
    let btn1 = getButtonRect(1);
    let btn2 = getButtonRect(2);

    if (
      mouseX > btn0.x &&
      mouseX < btn0.x + btn0.w &&
      mouseY > btn0.y &&
      mouseY < btn0.y + btn0.h
    ) {
      console.log("네번째 화면 1번 SELECT 클릭");
    }

    else if (
      mouseX > btn1.x &&
      mouseX < btn1.x + btn1.w &&
      mouseY > btn1.y &&
      mouseY < btn1.y + btn1.h
    ) {
      console.log("네번째 화면 2번 SELECT 클릭");
    }

    else if (
      mouseX > btn2.x &&
      mouseX < btn2.x + btn2.w &&
      mouseY > btn2.y &&
      mouseY < btn2.y + btn2.h
    ) {
      console.log("네번째 화면 3번 SELECT 클릭");
    }
  }
}

// ===============================
// 키보드 입력
// ===============================

function keyPressed() {
  if (scene == 1 && keyCode === ENTER) {
    scene = 2;
    return;
  }

  if (
    keyCode === ENTER &&
    (
      (scene == 3 && gameClear) ||
      (scene == 4 && iceGameClear)
    )
  ) {
    scene = 5;
    return;
  }

  if (scene == 3) {
    if (!gameOver) {
      if (keyCode === UP_ARROW && snakeDir.y === 0) {
        snakeDir.set(0, -gridSize);
      } else if (keyCode === DOWN_ARROW && snakeDir.y === 0) {
        snakeDir.set(0, gridSize);
      } else if (keyCode === LEFT_ARROW && snakeDir.x === 0) {
        snakeDir.set(-gridSize, 0);
      } else if (keyCode === RIGHT_ARROW && snakeDir.x === 0) {
        snakeDir.set(gridSize, 0);
      }
    } else {
      if (key === "r" || key === "R") {
        resetSnakeGame();
      } else if (keyCode === ESCAPE) {
        scene = 2;
      }
    }
  }

  if (scene == 4) {
    if (iceGameOver || iceGameClear) {
      if (key === "r" || key === "R") {
        resetIceGame();
      } else if (keyCode === ESCAPE) {
        scene = 2;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (scene == 3) {
    resetSnakeGame();
  }

  if (scene == 4) {
    resetIceGame();
  }
}