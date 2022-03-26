window.addEventListener("DOMContentLoaded", init);

function init(event) {
  loadBikes();
}

async function loadBikes() {
  const response = await fetch(
    "https://rigretah.dk/wp-bike/wp-json/wp/v2/bike?_embed"
  );
  console.log("GRGR-response", response);
  const thedata = await response.json();
  console.log("thedata", thedata);
  displayData(thedata);
}

function displayData(bikes) {
  console.log(bikes);
  bikes.forEach((bike) => {
    console.log(bike.title.rendered);
    const templateEl = document.querySelector("template").content;
    const cloneEl = templateEl.cloneNode(true);

    console.log(
      "Medium size image URL: ",
      bike._embedded["wp:featuredmedia"][0].media_details.sizes.medium
        .source_url
    );
    // Set Image
    cloneEl.querySelector("img").src = bike
                                        ._embedded["wp:featuredmedia"][0]
                                        .media_details
                                        .sizes.medium_large
                                        .source_url;

    // Set name
    cloneEl.querySelector(".bike-name").textContent = bike.title.rendered;

    // Set brand
    cloneEl.querySelector(".brand").textContent =
      bike._embedded["wp:term"][0][0].name;

    // Set price
    let priceEl = cloneEl.querySelector(".price span");
    let priceText = bike.price;

    // If more than 1 price set both
    if (bike.price_to > 0) {
      let appendText = " - $" + bike.price_to;
      priceText += appendText;
    }

    priceEl.textContent += priceText;


    // Set colors as boxes
    let colors = bike._embedded["wp:term"][1];
    if (colors.length) {
      //   alert("hey");
      cloneEl.querySelector(".colour span").textContent = "";
      const ulEl = document.createElement("ul");
      colors.forEach((color) => {
        const liEl = document.createElement("li");
        liEl.style.backgroundColor = color.name;
        console.log("Color: " + color.name);
        ulEl.appendChild(liEl);
      });
      cloneEl.querySelector(".colour span").appendChild(ulEl);
    }

    //   Set in stock or not paragraph
    let stock = bike.in_stock;
    console.log("In stock? : " + stock);
    if (stock > 0) {
      cloneEl.querySelector(".inStock span").textContent = stock;
    } else {
      cloneEl.querySelector(".inStock span").textContent = "Not Available";
    }

    const parentEl = document.querySelector("main");
    parentEl.appendChild(cloneEl);
  });
}
