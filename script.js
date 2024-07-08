const BASE_URL = "https://v6.exchangerate-api.com/v6/09691e6551c49688bc9a592f/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");



// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currcode;
    newOption.value = currcode;
    select.append(newOption);
  }
}

// Update flag based on selected currency
const updateFlag = (element) => {
  let currcode = element.value;
  let countrycode = countryList[currcode];
  let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newsrc;
};

// Add change event listener to update flag on currency selection
for (let select of dropdowns) {
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Handle currency conversion on button click
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount input");
  let amtval = parseFloat(amount.value);

  if (isNaN(amtval) || amtval < 1) {
    amtval = 1;
    amount.value = "1";
  }

  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();

    if (data.result === "success") {
      let fromRate = data.conversion_rates[fromcurr.value];

      console.log("reached here fromRate", fromRate)
      let toRate = data.conversion_rates[tocurr.value];
      console.log("reached here toRate", toRate)
      let rate = toRate / fromRate;
      console.log("reached here rate", rate)
      console.log("reached here amtval", amtval)

      let finalAmount = amtval * rate;

      console.log("reached here finalAmount", finalAmount)

      msg.innerText = `${amtval} ${fromcurr.value} = ${finalAmount.toFixed(2)} ${tocurr.value}`;
    } else {
      msg.innerText = "Error fetching exchange rates.";
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    msg.innerText = "Error fetching exchange rates.";
  }
});
