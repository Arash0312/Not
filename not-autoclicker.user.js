// ==UserScript==
// @name         کانال سازنده: @AirdropBeFarsi
// @namespace    Violentmonkey Scripts
// @match        *://*notpx.app/*
// @version      1.5
// @grant        none
// @icon         https://notpx.app/favicon.ico
// @downloadURL  https://github.com/Arash0312/Not/raw/main/not-autoclicker.user.js
// @updateURL    https://github.com/Arash0312/Not/raw/main/not-autoclicker.user.js
// @homepage     https://github.com/Arash0312/Not
// ==/UserScript==

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback), 500);
  }
}

function simulatePointerEvents(element, startX, startY, endX, endY) {
  const events = [
    new PointerEvent('pointerdown', { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent('pointermove', { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent('pointermove', { clientX: endX, clientY: endY, bubbles: true }),
    new PointerEvent('pointerup', { clientX: endX, clientY: endY, bubbles: true })
  ];

  events.forEach(event => element.dispatchEvent(event));
}

function openPaintWindow() {
  waitForElement('#canvasHolder', (canvas) => {
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    simulatePointerEvents(canvas, centerX, centerY, centerX, centerY);
    console.log('Попытка открыть окно рисования');
  });
}

function randomClick() {
  const paintButton = document.querySelector('#root > div > div._order_panel_9t9ju_1 > div > button');
  if (paintButton) {
    const buttonText = paintButton.querySelector('#root > div > div._order_panel_9t9ju_1 > div > button > span').textContent;

    if (buttonText === 'Paint') {
      waitForElement('#canvasHolder', (canvas) => {
        // Случайное перемещение карты
        const moveX = Math.floor(Math.random() * 200) - 100; // От -100 до 100
        const moveY = Math.floor(Math.random() * 200) - 100; // От -100 до 100
        simulatePointerEvents(canvas, canvas.width / 2, canvas.height / 2, canvas.width / 2 + moveX, canvas.height / 2 + moveY);

        // Случайная точка для рисования
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        simulatePointerEvents(canvas, x, y, x, y);

        simulatePointerEvents(paintButton, 0, 0, 0, 0);
        const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
        setTimeout(randomClick, nextClickDelay);
      });
    } else if (buttonText === 'No energy') {
      console.log('Нет энергии. Пауза на 1 минуту.');
      setTimeout(randomClick, 60000);
    } else {
      const nextClickDelay = Math.floor(Math.random() * 1000) + 1000;
      setTimeout(randomClick, nextClickDelay);
    }
  } else {
    console.log('Окно рисования не найдено. Попытка открыть.');
    openPaintWindow();
    setTimeout(randomClick, 2000);
  }
}

function checkGameCrash() {
  const crashElement = document.querySelector('div._container_ieygs_8');
  if (crashElement) {
    console.log('Игра вылетела. Обновление страницы.');
    location.reload();
  } else {
    setTimeout(checkGameCrash, 2000);
  }
}

checkGameCrash();


function startScript() {
  openPaintWindow();
  setTimeout(randomClick, 2000);
}

startScript();
