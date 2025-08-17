let counter = 0;

function getCounts() {
  setTimeout(() => {
    counter++;
    console.log(counter);
  }, 1000);
}

getCounts();
