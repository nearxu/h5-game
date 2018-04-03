class Block {
  constructor(props) {
    this.size = props.size;
    this.arr = props.arr;
    this.BLOCK_SIZE = props.BLOCK_SIZE;
  }
  init() {
    this.checkArrWith1(this.arr, this.draw);
  }
  checkArrWith1(arr, callback) {
    for (let i = 0; i <= arr.length - 1; i++) {
      for (let j = 0; j <= arr.length - 1; j++) {
        if (arr[i][j] === 1) {
          callback.call(this, i, j);
        }
      }
    }
  }
  draw(i, j) {
    let model = document.createElement("div");
    model.className = "activityModel";
    //控制方块出现在画布顶端中间
    model.style.top = `${this.size.top + i * this.BLOCK_SIZE}px`;
    model.style.left = `${this.size.left +
      this.size.width / 2 +
      j * this.BLOCK_SIZE}px`;
    //添加方块
    document.body.appendChild(model);
  }
  move() {
    document.onkeydown = e => {
      let model = document.querySelectorAll(".activityModel");
      const code = e.keyCode;
      let {
        canMoveDown,
        canMoveLeft,
        canMoveRight,
        canMoveTop
      } = this.canMove();
      switch (code) {
        case 37:
          if (canMoveLeft) {
            for (let v of model) {
              v.style.left = `${parseInt(v.style.left) - 20}px`;
            }
          } else {
            alert("no left");
          }
          break;
        case 38:
          if (canMoveTop) {
            for (let v of model) {
              v.style.top = `${parseInt(v.style.top) - 20}px`;
            }
          } else {
            alert("no top");
          }
          break;
        case 39:
          if (canMoveRight) {
            for (let v of model) {
              v.style.left = `${parseInt(v.style.left) + 20}px`;
            }
          } else {
            alert("no left");
          }
          break;
        case 40:
          if (canMoveDown) {
            for (let v of model) {
              v.style.top = `${parseInt(v.style.top) + 20}px`;
            }
          } else {
            alert("no left");
          }
          break;

        default:
          break;
      }
    };
  }
  canMove() {
    let model = Array.from(document.querySelectorAll(".activityModel"));
    let tops = model.map(m => parseInt(m.style.top));
    let lefts = model.map(m => parseInt(m.style.left));

    let top = Math.min(...tops),
      down = Math.max(...tops),
      left = Math.min(...lefts),
      right = Math.max(...lefts),
      canMoveRight = true,
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

  //方块矩阵数组
  const arr = [[1, 1], [1, 1]];
  //方块大小
  const BLOCK_SIZE = 20;
  //传入Block的变量
  const props = {
    arr,
    size,
    BLOCK_SIZE
  };
  let block = new Block(props);
  block.init();
  block.move();
};
