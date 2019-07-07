const btnBegin = document.querySelector("#begin");
const btnIngredients = [...document.querySelectorAll("aside button")];
const frmOrder = document.querySelector("#order");
const frmIngredients = [...document.querySelectorAll("li")];
const btnListen = document.querySelector("#listen");

// const coords = {
//   "//": "vertical coordinate of the middle column where food will animate in",
//   y: 600
// };

// will store all individual Ingredient objects in this array called ingredients
const ingredients = [];

let listenFlag, isSupported;

/* Constructor Function
-------------------------------------------------- */
class Ingredient {
  constructor(name, node) {
    this.name = name;
    this.node = node;
  }
}

btnListen.addEventListener("click", listenToggle);

btnBegin.addEventListener("click", restart);

btnIngredients.map(btnIngredient =>
  btnIngredient.addEventListener("click", buildBurger)
);

frmIngredients.map(
  frmIngredient => (frmIngredient.style.visibility = "hidden")
);

function restart() {
  let synth = window.speechSynthesis;
  // Create a new speech object, attaching the string of text to speak
  let utterThis = new SpeechSynthesisUtterance(
    "Welcome to McTims, May I take your order?"
  );
  // Actually speak the text
  synth.speak(utterThis);
  frmIngredients.map(
    frmIngredient => (frmIngredient.style.visibility = "hidden")
  );
  ingredients.forEach(ingredient =>
    document.getElementById(ingredient.name).remove()
  );
  ingredients.length = 0;
  console.clear();
}

// this function will store the ingredient pressed into the array ingredients
function buildBurger(choice, category, manual = true) {
  if (manual) {
    choice = this.dataset.choice;
    category = this.parentNode.id;
  }

  if (
    !ingredients.some((ingredient, i) => {
      if (choice === ingredient.name) {
        ingredients.splice(i, 1);
        document.querySelector(`[data-ingredient=${choice}]`).style.visibility =
          "hidden";
        document.getElementById(choice).remove();
        return true;
      }
    })
  ) {
    ingredients.push(new Ingredient(choice, category));
    document.querySelector(`[data-ingredient=${choice}]`).style.visibility =
      "visible";
    frmOrder.insertAdjacentHTML(
      "beforeend",
      `<div id=${choice}>${choice}</div>`
    );
  }
  // showBurger();
}

// this function will show the pre-built burger
// function showBurger() {
//   // console.clear();
//   ingredients.forEach(ingredient => console.log(ingredient.name));
// }

SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if ("SpeechRecognition" in window) {
  console.log("Speech recognition API supported");
  isSupported = true;
  listenFlag = true;
} else {
  console.log("Speech recognition API not supported");
  isSupported = false;
}

const recognition = new SpeechRecognition();

recognition.interimResults = false;
recognition.lang = "en-US";

recognition.addEventListener("result", e => {
  let transcript = e.results[0][0].transcript;

  console.log(`I heard: ${transcript}`);

  btnIngredients.forEach(btnIngredient => {
    let choice = btnIngredient.dataset.choice;
    let category = btnIngredient.parentNode.id;
    if (transcript.includes(choice)) {
      buildBurger(choice, category, false);
    }
  });
});

function listenToggle() {
  if(isSupported) {
  if (listenFlag) {
    // use speech recognition to 'type' your essay

    recognition.addEventListener("end", recognition.start);
    btnListen.textContent = "Listen ON";
    recognition.start();

    // Make it so that if user says 'D final answer', window alerts us 'D was chosen'
  } else {
    recognition.removeEventListener("end", recognition.start);
    btnListen.textContent = "Listen OFF";
    recognition.stop();
  }

  listenFlag = !listenFlag;
} else {
  console.log("Speech recognition API not supported");
}

}
