class Block {
  init() {
    let model = document.createElement("div");
    model.className = "activityModel";
    document.body.appendChild(model);
  }
  move() {
    document.onkeydown = e => {
      let model = document.querySelector(".activityModel");
      let left = parseInt(model.style.left) ? parseInt(model.style.left) : 0;
      let top = parseInt(model.style.top) ? parseInt(model.style.top) : 0;
      const code = e.keyCode;
      switch (code) {
        case 37:
          model.style.left = `${left - 20}px`;
          break;
        case 38:
          model.style.top = `${top - 20}px`;
          break;
        case 39:
          model.style.left = `${left + 20}px`;
          break;
        case 40:
          model.style.top = `${top + 20}px`;
          break;

        default:
          break;
      }
    };
  }
}

window.onload = () => {
  let block = new Block();
  block.init();
  block.move();
};
