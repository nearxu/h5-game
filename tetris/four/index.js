class Block {
  constructor(props) {
    this.size = props.size;
    this.arr = props.arr;
    this.BLOCK_SIZE = props.BLOCK_SIZE;
    this.curLeft = props.curLeft;
    this.curTop = props.curTop;
  }
  //  [[1,0],[1,0],[1,1] => [[1,1,1],[1,0,0]]
  clockwise(arr) {
    let newArr = [];
    arr = [[1, 0], [1, 0], [1, 1]];
    for (let i = 0; i <= arr.length - 1; i++) {
      let temArr = [];
      for (let j = arr.length - 1; j >= 0; j--) {
        temArr.push(arr[j][i]);
      }
      newArr.push(temArr);
    }
    let lefts = [];
    let tops = [];
    this.checkArrWith1(newArr, function(i, j) {
      lefts.push(j * this.BLOCK_SIZE);
      tops.push(i * this.BLOCK_SIZE);
    });
    console.log(newArr, lefts, tops, "new arr");
    return {
      newArr,
      lefts,
      tops
    };
  }
  init() {
    this.checkArrWith1(this.arr, this.draw);
  }
  checkArrWith1(arr, callback) {
    for (let i = 0; i <= arr.length - 1; i++) {
      for (let j = 0; j <= arr.length - 1; j++) {
        if (arr[i][j] === 1) {
          callback.call(this, i + this.curTop, j + this.curLeft);
        }
      }
    }
  }
  draw(i, j) {
    let model = document.createElement("div");
    model.className = "activityModel";
    //控制方块出现在画布顶端中间
    model.style.top = `${i * this.BLOCK_SIZE}px`;
    model.style.left = `${j * this.BLOCK_SIZE}px`;
    //添加方块
    document.body.appendChild(model);
  }
  move() {
    document.onkeydown = e => {
      let model = document.querySelectorAll(".activityModel");
      const code = e.keyCode;
      let { canMoveDown, canMoveLeft, canMoveRight, canMoveTop } = this.canMove(
        this.arr
      );
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
          let { newArr, lefts, tops } = this.clockwise(this.arr);
          let move = this.canMove(newArr, true);
          if (canMoveTop) {
            for (let i of lefts) {
              model[i].style.left = `${lefts[i]}px`;
              model[i].style.top = `${tops[i]}px`;
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
  canMove(arr, deform = false) {
    let tops = [],
      lefts = [];
    //获取当前矩阵数组为1的偏移量
    this.checkArrWith1(arr, function(i, j) {
      tops.push(parseInt(i * this.BLOCK_SIZE));
      lefts.push(parseInt(j * this.BLOCK_SIZE));
    });
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
  const arr = [[1, 0], [1, 0], [1, 1]];
  //方块大小
  const BLOCK_SIZE = 20;
  let curLeft = parseInt((size.left + size.width / 2) / BLOCK_SIZE);
  let curTop = parseInt(size.top / BLOCK_SIZE);
  console.log(curLeft, "curleft", curTop);
  //传入Block的变量
  const props = {
    arr,
    size,
    BLOCK_SIZE,
    curLeft,
    curTop
  };
  let block = new Block(props);
  block.init();
  block.move();
};
