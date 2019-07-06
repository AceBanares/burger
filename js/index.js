const btnBegin = document.querySelector("#begin");
const btnIngredients = [...document.querySelectorAll(".choices")];
const frmOrder = document.querySelector("#order");
const frmIngredients = [...document.querySelectorAll("li")];

const coords = {
  "//": "vertical coordinate of the middle column where food will animate in",
  y: 600
};

// will store all individual Ingredient objects in this array called ingredients
const ingredients = [];

/* Constructor Function
-------------------------------------------------- */
class Ingredient {
  constructor(name, node) {
    this.name = name;
    this.node = node;
  }
}

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

btnBegin.addEventListener("click", restart);

btnIngredients.map(btnIngredient =>
  btnIngredient.addEventListener("click", buildBurger)
);

frmIngredients.map(
  frmIngredient => (frmIngredient.style.visibility = "hidden")
);

// this function will store the ingredient pressed into the array ingredients
function buildBurger(e) {
  choice = e.target.dataset.choice;

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
    ingredients.push(new Ingredient(choice, this.id));
    document.querySelector(`[data-ingredient=${choice}]`).style.visibility =
      "visible";
    frmOrder.insertAdjacentHTML(
      "beforeend",
      `<div id=${choice}>${choice}</div>`
    );
  }
  showBurger();
}

// this function will show the pre-built burger
function showBurger() {
  console.clear();
  ingredients.forEach(ingredient => console.log(ingredient.name));
}

// use speech recognition to 'type' your essay
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.interimResults = false;
recognition.lang = "en-US";

recognition.addEventListener("result", e => {
  let transcript = e.results[0][0].transcript;
  console.log(transcript);

  //           switch (transcript) {
  //             case 'double double':
  //               essay.insertAdjacentHTML('beforeEnd', `<p>2 Milk</p><p>2 Sugar</p>`)
  //               // expected output: "Mangoes and papayas are $2.79 a pound."
  //               break;

  // }

  // essay.insertAdjacentHTML('beforeEnd', `<p>${transcript}</p>`)
});
recognition.addEventListener("end", recognition.start);

recognition.start();

// Make it so that if user says 'D final answer', window alerts us 'D was chosen'
