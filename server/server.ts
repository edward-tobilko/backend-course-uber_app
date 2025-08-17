let counter = 0;

function getCounts() {
  setInterval(() => {
    if (counter < 5) {
      counter++;
      console.log(counter);
    }
  }, 1000);
}

getCounts();
