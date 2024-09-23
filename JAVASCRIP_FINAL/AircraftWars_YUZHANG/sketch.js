let bg_img; // Imagen de fondo 1 // 第一张背景图像
let bg_img2; // Imagen de fondo 2 // 第二张背景图像
let bgY1 = 0; // Posición vertical de fondo 1 // 第一张背景的垂直位置
let bgY2; // Posición vertical de fondo 2 // 第二张背景的垂直位置

let explosions = [];

let currentFrame = 0;
let myFighter_imgs = [];
let myFighter_img; // Imagen del avión del jugador // 玩家飞机图像
let enemyAircraft_img; // Imagen del avión enemigo // 敌机图像
let enemy_img;
let boss_img;
let bullet_img; // Imagen de la bala // 子弹图像
let enemyExplode_imgs = []; // Imagen de la explosión del enemigo // 敌机爆炸图像

let shot_sound; // Sonido del disparo // 射击声音
let bgm; // Música de fondo // 背景音乐
let explore; // Sonido de la explosión // 爆炸声音
let player_hit; // Sonido de ser golpeado // 飞机被击中声音
let enemy_hit; // Sonido de ser golpeado (Enemigo) // 敌人被击中声音

let player_speed = 6; // Velocidad de movimiento del jugador // 玩家移动速度
let player_posicion = { x: 0, y: 0 }; // Posición inicial del jugador // 玩家初始位置
let player_health = 3; // Vida del jugador // 玩家生命值

let enemy_speed = 6; // Velocidad de movimiento del enemigo // 敌机移动速度
let enemy_speedAccelerated = false;
let enemy_posicion = { x: 0, y: 0 }; // Posición inicial del enemigo // 敌机初始位置
let enemy_health; // Vida del enemigo // 敌机生命值
let enemyTemporary_health;
let enemyBullets = []; // Arreglo de balas del enemigo // 敌机子弹数组

let bossExplode_imgs = [];

let p_limit_Left; // Límite izquierdo // 左边界限制
let p_limit_Right; // Límite derecho // 右边界限制
let p_limit_Up; // Límite superior // 上边界限制
let p_limit_Down; // Límite inferior // 下边界限制

let bullets = []; // Arreglo de balas // 子弹数组
let bullets_speed = 12; // Velocidad de movimiento de las balas // 子弹移动速度
let shoot_freq = 1000;
let enemyShoot_freq = 500;
let shootTimer = 0; // Temporizador de frecuencia de disparo // 射击频率计时器
let enemyShootTimer = 0;

let mouseControl = false; // Control del ratón // 鼠标控制
let isMoving = false; // Variable para rastrear si el avión se está moviendo // 用于跟踪飞机是否移动的变量

let gameState = "start";
let currentLevel = 1;
let enemiesDestroyed = 0;
let totalEnemies = 1;

let endlessMode = false;

function preload() {
  bg_img = loadImage("source/image/bg.png"); // Cargar imagen de fondo 1 // 加载第一张背景图像
  bg_img2 = loadImage("source/image/bg2.png"); // Cargar imagen de fondo 2 // 加载第二张背景图像
  myFighter_img = loadImage("source/image/plane1.png");

  boss_img = loadImage("source/image/boss.png"); // Cargar imagen de boss // 加载BOSS图像

  for (let i = 1; i <= 2; i++) {
    myFighter_imgs.push(loadImage("source/image/plane" + i + ".png"));
  }

  for (let i = 1; i < 5; i++) {
    enemyExplode_imgs.push(loadImage("source/image/enemy_down" + i + ".png")); // Cargar imagen de la explosión del enemigo // 加载敌机爆炸图像
  }

  for (let i = 1; i < 5; i++) {
    bossExplode_imgs.push(loadImage("source/image/boss_down" + i + ".png")); // Cargar imagen de la explosión del boss // 加载BOSS爆炸图像
  }

  enemyAircraft_img = loadImage("source/image/enemy.png"); // Cargar imagen del avión enemigo // 加载敌机图像
  bullet_img = loadImage("source/image/bullet.png"); // Cargar imagen de la bala // 加载子弹图像

  soundFormats("mp3");
  bgm = loadSound("source/music/bg2.mp3"); // Cargar música de fondo // 加载背景音乐
  enemy_hit = loadSound("source/music/enemy_hit.mp3");
  player_hit = loadSound("source/music/player_hit.mp3");

  soundFormats("ogg");
  explore = loadSound("source/music/boom.ogg"); // Cargar sonido de explosión // 加载爆炸声音
  shot_sound = loadSound("source/music/bullet.ogg"); // Cargar sonido de disparo // 加载射击声音
}

function setup() {
  createCanvas(768, 1024); // Crear un lienzo de 768x1024 píxeles // 创建一个768x1024像素的画布

  bgY2 = -height; // Inicializar posición vertical de fondo 2, colocándolo arriba de la pantalla // 初始化第二张背景的垂直位置，使其在画布上方

  player_posicion.x = width / 2; // Establecer posición inicial en el centro del lienzo // 将初始x位置设置为画布中心
  player_posicion.y = height - myFighter_img.height; // Establecer posición inicial en la parte inferior del lienzo // 将初始y位置设置为画布底部
  p_limit_Left = myFighter_img.width / 6; // Establecer límite izquierdo // 设置左边界
  p_limit_Right = bg_img.width - myFighter_img.width / 6; // Establecer límite derecho // 设置右边界
  p_limit_Up = myFighter_img.height / 2; // Establecer límite superior // 设置上边界
  p_limit_Down = height - myFighter_img.height / 2; // Establecer límite inferior // 设置下边界

  bgm.loop(); // Comenzar a reproducir la música de fondo // 开始播放背景音乐
}

function draw() {
  background(220); // Limpiar el fondo

  if (gameState === "start") {
    if (!bgm.isLooping()) {
      bgm.loop();
    }
    drawStartScreen();
  } else if (gameState === "levelIntro") {
    drawLevelIntro();
  } else if (gameState === "playing") {
    moveBackground();
    drawGame();
  } else if (gameState === "gameOver") {
    drawGameOver();
    bgm.stop();
  }
}

// Cambiar la forma de moverse // 改变移动方式
function mousePressed() {
  if (gameState === "start") {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
      if (mouseY > height / 2 - 50 && mouseY < height / 2) {
        startGame("level");
      } else if (mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
        startGame("endless");
      }
    }
  } else if (gameState === "gameOver") {
    restartGame();
  } else {
    mouseControl = !mouseControl;
  }
}

function restartGame() {
  gameState = "start";
  enemy_speed = 6;
  enemyShoot_freq = 500;
  player_speed = 6;
  bullets_speed = 12;
  shoot_freq = 1000;
  totalEnemies = 1;
  enemiesDestroyed = 0;
  player_health = 3;
  enemy_health = 2;
  enemyTemporary_health = enemy_health;
  enemy_img = enemyAircraft_img;
  loop();
}

function startGame(mode) {
  if (mode === "level") {
    endlessMode = false;
    gameState = "levelIntro";
    currentLevel = 1;
  } else if (mode === "endless") {
    endlessMode = true; // 标识当前模式为无限模式
    currentLevel = 0;
    gameState = "playing"; // 直接进入游戏状态
  }

  enemy_img = enemyAircraft_img;

  enemy_health = 2;
  enemyTemporary_health = enemy_health;
}

function drawStartScreen() {
  background(100);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("AircraftWars", width / 2, height / 4);
  textSize(25);
  text("Click to select mode", width / 2, height / 4 + 40);

  textSize(20);
  fill(0, 255, 0);
  rect(width / 2 - 100, height / 2 - 50, 200, 50);
  fill(0);
  text("Challenge Mode", width / 2, height / 2 - 25);

  fill(255, 0, 0);
  rect(width / 2 - 100, height / 2 + 50, 200, 50);
  fill(0);
  text("Endless Mode", width / 2, height / 2 + 75);
}

function drawLevelIntro() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Level " + currentLevel, width / 2, height / 2);
  setTimeout(() => {
    gameState = "playing";
  }, 2000);
}

function drawGame() {
  background(220); // Limpiar el fondo // 清除背景
  image(bg_img, 0, bgY1, width, height); // Dibujar la imagen de fondo // 绘制背景图像
  image(bg_img2, 0, bgY2, width, height); 
  // Dibujar el avión del jugador // 绘制玩家飞机
  push();

  imageMode(CENTER);
  myFighter_img = myFighter_imgs[currentFrame]; // Get the current player aircraft image // 获取当前的玩家飞机图片
  image(myFighter_img, player_posicion.x, player_posicion.y);

  if (isMoving && frameCount % 10 === 0) {
    currentFrame = (currentFrame + 1) % myFighter_imgs.length; // Change the frame index // 更改帧索引
  }

  // Control del ratón // 鼠标控制
  if (mouseControl) {
    movimientoMouse();
  } else {
    movimientoKey();
  }

  playerShooting();

  drawEnemy();

  enemyShooting();

  drawGameInfo();
  // Comprobar colisiones // 检查碰撞
  checkCollisions();

  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].draw();
    if (explosions[i].finished) {
      explosions.splice(i, 1); // 移除已完成的爆炸
    }
  }

  pop();
}

function drawGameOver() {
  background(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text("Game Over", width / 2, height / 2);

  fill(255);
  textSize(25);
  text("Click to Restart", width / 2, height / 2 + 50);

  noLoop();
}

function drawGameWin() {
  background(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255, 255, 0);
  text("Victory", width / 2, height / 2);

  fill(255);
  textSize(25);
  text("Click to Restart", width / 2, height / 2 + 50);

  noLoop();
}

function drawEnemy() {
  image(enemy_img, enemy_posicion.x, enemy_posicion.y);

  // Calcular dirección hacia el jugador
  const dirX = player_posicion.x - enemy_posicion.x;
  const dirY = player_posicion.y - enemy_posicion.y;
  const distance = sqrt(dirX * dirX + dirY * dirY);

  if (dirY <= 0 && abs(dirX) < bg_img.width / 3 && !enemy_speedAccelerated) {
    enemy_speed *= 3; // Acelerar la nave enemiga
    enemy_speedAccelerated = true;
  }

  // Mover el enemigo hacia el jugador manteniendo una distancia constante
  if (distance > myFighter_img.width) {
    enemy_posicion.x += (dirX / distance) * enemy_speed;
  }

  enemy_posicion.y += enemy_speed; // Mover la nave enemiga hacia abajo

  if (enemy_posicion.y > height) {
    enemy_speed /= 3;
    enemy_speedAccelerated = false;
    enemy_posicion.y = -enemy_img.height; // Mover la nave enemiga arriba de la pantalla
  }
}

function checkCollisions() {
  // Comprobar colisiones entre balas del jugador y el enemigo
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    let d = dist(bullet.x, bullet.y, enemy_posicion.x, enemy_posicion.y);
    if (d < myFighter_img.width / 2) {
      enemy_hit.play();
      enemy_health--; // Reducir la vida del enemigo // 减少敌机生命值
      bullets.splice(i, 1); // Eliminar la bala // 移除子弹
      if (enemy_health <= 0) {
        // Si la vida del enemigo es igual o menor que cero // 如果敌机生命值小于等于零
        const explode_imgs =
          enemy_img === boss_img ? bossExplode_imgs : enemyExplode_imgs;
        explore.play(); // Reproducir sonido de explosión // 播放爆炸声音
        explosions.push(
          new Explosion(enemy_posicion.x, enemy_posicion.y, explode_imgs, 30)
        );
        enemiesDestroyed++;
        if (endlessMode) {
          nextLevel(); // 无限模式下击杀敌机增加玩家生命值
        }
        if (enemiesDestroyed >= totalEnemies) {
          nextLevel();
        } else {
          resetEnemy();
        }
      }
    }
  }

  // Comprobar colisiones entre balas del enemigo y el jugador
  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    let d = dist(bullet.x, bullet.y, player_posicion.x, player_posicion.y);
    if (d < myFighter_img.width / 2) {
      player_hit.play();
      player_health--; // Reducir la vida del jugador // 减少玩家生命值
      enemyBullets.splice(i, 1); // Eliminar la bala del enemigo // 移除敌机子弹
      if (player_health <= 0) {
        // Si la vida del jugador es igual o menor que cero // 如果玩家生命值小于等于零
        gameState = "gameOver";
      }
    }
  }
}

function nextLevel() {
  if (endlessMode) {
    increaseAttributes();
  } else {
    currentLevel++;
    enemiesDestroyed = 0;
    player_health = 3;

    if (currentLevel === 1) {
      enemy_health = 3;
      totalEnemies = 1;
      enemy_speed = 6;
      enemyShoot_freq = 500;
    } else if (currentLevel === 2) {
      totalEnemies = 3;
      enemy_health = 5;
      enemy_speed = 8;
      enemyShoot_freq = 900;
    } else if (currentLevel === 3) {
      enemy_img = boss_img;
      totalEnemies = 1;
      enemy_health = 15;
      enemyShoot_freq = 1200;
      enemy_speed = 12;
      bullets_speed = 16;
    } else {
      drawGameWin();
      gameState = "gameOver";
      return;
    }

    enemyTemporary_health = enemy_health;
    gameState = "levelIntro";
    resetEnemy();
  }
}

function increaseAttributes() {
  if (int(random(0, 10)) === int(random(0, 10))) {
    enemy_img = boss_img;
  } else {
    enemy_img = enemyAircraft_img;
  }

  enemy_speed += 1; // 敌机速度加一
  enemy_health = ++currentLevel; // 敌机生命值加一
  enemyTemporary_health = enemy_health;

  if (enemyShoot_freq >= 100) {
    enemyShoot_freq -= 2.5;
  } // 敌机射击频率加快（时间间隔减少）

  player_speed += 0.1; // 玩家飞机速度加一
  bullets_speed += 0.1; // 子弹速度加一
  player_health++;
  if (shoot_freq >= 100) {
    shoot_freq -= 3;
  }
  totalEnemies++; // 增加敌机数量
  resetEnemy();
}

function resetEnemy() {
  enemy_posicion.x = random(p_limit_Left, p_limit_Right);
  enemy_posicion.y = random(p_limit_Up, p_limit_Down);
  enemy_health = enemyTemporary_health;
}

function movimientoMouse() {
  const intervaloX = constrain(mouseX, p_limit_Left, p_limit_Right); // Limitar la posición x del ratón // 限制鼠标x位置
  const intervaloY = constrain(mouseY, p_limit_Up, p_limit_Down); // Limitar la posición y del ratón // 限制鼠标y位置

  const distanciaX = intervaloX - player_posicion.x; // Distancia en dirección x // x方向上的距离
  const distanciaY = intervaloY - player_posicion.y; // Distancia en dirección y // y方向上的距离

  const distancia = dist(
    player_posicion.x,
    player_posicion.y,
    intervaloX,
    intervaloY
  ); // Calcular la distancia // 计算距离

  if (distancia > player_speed) {
    // Si la distancia es mayor que la velocidad de movimiento // 如果距离大于移动速度
    player_posicion.x += (distanciaX / distancia) * player_speed; // Normalizar y multiplicar por la velocidad de movimiento // 归一化并乘以移动速度
    player_posicion.y += (distanciaY / distancia) * player_speed;
    isMoving = true; // El avión se está moviendo // 飞机正在移动
  } else {
    // Si la distancia es menor o igual a la velocidad de movimiento // 如果距离小于等于移动速度
    player_posicion.x = intervaloX; // Establecer directamente la posición objetivo // 直接设置为目标位置
    player_posicion.y = intervaloY;
  }
}

function movimientoKey() {
  // Control del teclado // 键盘控制
  // Izquierda y 'A' // 左箭头和'A'键
  if (
    (keyIsDown(LEFT_ARROW) || keyIsDown(65)) &&
    player_posicion.x >= p_limit_Left
  ) {
    player_posicion.x -= player_speed;
    isMoving = true; // El avión se está moviendo // 飞机正在移动
  }

  // Derecha y 'D' // 右箭头和'D'键
  if (
    (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) &&
    player_posicion.x <= p_limit_Right
  ) {
    player_posicion.x += player_speed;
    isMoving = true; // El avión se está moviendo // 飞机正在移动
  }

  // Arriba y 'W' // 上箭头和'W'键
  if (
    (keyIsDown(UP_ARROW) || keyIsDown(87)) &&
    player_posicion.y >= p_limit_Up
  ) {
    player_posicion.y -= player_speed;
    isMoving = true; // El avión se está moviendo // 飞机正在移动
  }

  // Abajo y 'S' // 下箭头和'S'键
  if (
    (keyIsDown(DOWN_ARROW) || keyIsDown(83)) &&
    player_posicion.y <= p_limit_Down
  ) {
    player_posicion.y += player_speed;
    isMoving = true; // El avión se está moviendo // 飞机正在移动
  }
}

function playerShooting() {
  // Preparar bala // 处理子弹
  shootTimer += deltaTime / shoot_freq; // Incrementar el temporizador de frecuencia de disparo // 增加射击频率计时器
  // Generar bala solo si el avión se está moviendo // 只有当飞机移动时生成子弹
  if (shootTimer > 1 && isMoving) {
    let bullet = {
      x: player_posicion.x,
      y: player_posicion.y - myFighter_img.height / 2,
    }; // Crear nueva bala // 创建新子弹
    bullets.push(bullet);
    shot_sound.play();
    shootTimer = 0; // Reiniciar temporizador // 重置计时器
  }

  // Dibujar y mover balas // 绘制和移动子弹
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.y -= bullets_speed; // Mover bala hacia arriba // 子弹向上移动
    image(bullet_img, bullet.x, bullet.y); // Dibujar bala // 绘制子弹

    // Eliminar balas que están fuera de la pantalla // 移除屏幕外的子弹
    if (bullet.y < 0) {
      bullets.splice(i, 1);
      break;
    }
  }
}

function enemyShooting() {
  enemyShootTimer += deltaTime / enemyShoot_freq;
  if (enemyShootTimer > 1) {
    let bullet = {
      x: enemy_posicion.x,
      y: enemy_posicion.y + enemy_img.height / 2,
    }; // Crear una nueva bala en la parte inferior de la nave enemiga
    enemyBullets.push(bullet);
    shot_sound.play();
    enemyShootTimer = 0; // Reiniciar el temporizador de disparo
  }

  // Dibujar y mover balas del enemigo // 绘制和移动敌机子弹
  for (let i = 0; i < enemyBullets.length; i++) {
    let bullet = enemyBullets[i];
    bullet.y += bullets_speed; // Mover bala hacia abajo // 子弹向下移动
    push();
    translate(bullet.x, bullet.y); // Trasladar al punto de la bala
    rotate(PI); // Rotar 180 grados
    image(bullet_img, 0, 0); // Dibujar bala
    pop();

    // Eliminar balas que están fuera de la pantalla // 移除屏幕外的子弹
    if (bullet.y > height) {
      enemyBullets.splice(i, 1);
      break;
    }
  }
}

class Explosion {
  constructor(x, y, imgs, frameRate) {
    this.x = x;
    this.y = y;
    this.imgs = imgs;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.finished = false;
    this.lastFrameChange = millis();
  }

  update() {
    if (millis() - this.lastFrameChange > 1000 / this.frameRate) {
      this.currentFrame++;
      this.lastFrameChange = millis();
      if (this.currentFrame >= this.imgs.length) {
        this.finished = true;
      }
    }
  }

  draw() {
    if (!this.finished) {
      image(this.imgs[this.currentFrame], this.x, this.y);
    }
  }
}

function drawGameInfo() {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text("Health: " + player_health, 10, 10); // Mostrar la vida del jugador // 显示玩家生命值
  if (!endlessMode) {
    text("Level: " + currentLevel, 10, 40); // Mostrar el nivel actual // 显示当前级别
  }
  text("Enemies Destroyed: " + enemiesDestroyed, 10, 70); // 显示击毁敌机数量

  textAlign(RIGHT, TOP);
  textSize(20);
  text("Enemy Health: " + enemy_health, width - 10, 10);
}

function moveBackground() {
  // Mover ambas imágenes de fondo hacia abajo en cada ciclo
  bgY1 += 3;
  bgY2 += 3;

  // Cuando la imagen de fondo 1 llega al fondo del lienzo, se mueve encima de la imagen de fondo 2, logrando un desplazamiento circular
  if (bgY1 >= height) {
    bgY1 = bgY2 - height;
  }

  // Cuando la imagen de fondo 2 llega al fondo del lienzo, se mueve encima de la imagen de fondo 1, logrando un desplazamiento circular
  if (bgY2 >= height) {
    bgY2 = bgY1 - height;
  }
}
