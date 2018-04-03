class Block {
  constructor(size) {
    this.size = size;
  }
  init() {
    let model = document.createElement("div");
    model.className = "activityModel";
    model.style.left = `${this.size.left}px`;
    model.style.top = `${this.size.top}px`;
    document.body.appendChild(model);
  }
  move() {
    document.onkeydown = e => {
      let model = document.querySelector(".activityModel");
      let left = parseInt(model.style.left) ? parseInt(model.style.left) : 0;
      let top = parseInt(model.style.top) ? parseInt(model.style.top) : 0;
      const code = e.keyCode;
      let {
        canMoveDown,
        canMoveLeft,
        canMoveRight,
        canMoveTop
      } = this.canMove();
      switch (code) {
        case 37:
          canMoveLeft
            ? (model.style.left = `${left - 20}px`)
            : alert("no left");
          break;
        case 38:
          canMoveTop ? (model.style.top = `${top - 20}px`) : alert("no top");
          break;
        case 39:
          canMoveRight
            ? (model.style.left = `${left + 20}px`)
            : alert("no right");
          break;
        case 40:
          canMoveDown ? (model.style.top = `${top + 20}px`) : alert("no up");
          break;

        default:
          break;
      }
    };
  }
  canMove() {
    let model = document.querySelector(".activityModel");
    let top = parseInt(model.style.top);
    let left = parseInt(model.style.left);
    let canMoveRight = true,
      canMoveTop = true,
      canMoveDown = true,
      canMoveLeft = true;
    if (left + 20 >= this.size.left + this.size.width) {
      canMoveRight = false;
    }
    if (left - 20 < this.size.left) {
      canMoveLeft = false;
    }
    if (top - 20 < this.size.top) {
      canMoveTop = false;
    }
    if (top + 20 >= this.size.top + this.size.height) {
      canMoveDown = false;
    }
    return {
      canMoveDown,
      canMoveLeft,
      canMoveRight,
      canMoveTop
    };
  }
}

window.onload = () => {
  //获取画布大小&位置
  let site = document.querySelector(".site");
  let { width, height, left, top } = window.getComputedStyle(site);
  let size = {
    width: parseInt(width),
    height: parseInt(height),
    left: parseInt(left),
    top: parseInt(top)
  };
  console.log(size, "size");
  //新建Block
  let block = new Block(size);
  block.init();
  block.move();
};
