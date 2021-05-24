class Calculator {
  //入力されたhtml要素を持つインスタンスを作る
  constructor(LastOperandTextElement, currentOperandTextElement) {
    this.LastOperandTextElement = LastOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    //最初は画面に何もうつっておらず算術記号も選ばれてないのでインスタンス化の際クリアメソッドを実行
    this.allclear()
  }

  allclear() {
    //現在入力された数値（文字として扱っている）を表示している部分を空文字にする
    this.currentOperand = ''
    //1つまえに入力された数値（文字として扱っている）を表示している部分を空文字にする
    this.previousOperand = ''
    //算術記号が何も選ばれてない状態にする
    this.operation = undefined
  }
  eventtype(){
    return window.ontouchstart ? 'touchstart':'click'
  }
  percent() {
    let resultper 
    const perNumber = this.currentOperand.toString()
    const per= parseFloat(perNumber)
    resultper= per/100
    this.currentOperand = resultper
    this.previousOperand = ''
  }
  backspace() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(PressedNumber) {
    //userが誤って小数点を2回以上押したときも正常に動くようにするための措置として
    //2回以上押されたらこのメソッドがうごかないようにする
    if(PressedNumber==='.'&&this.currentOperand.includes('.')){return }
     this.currentOperand = `${this.currentOperand}${PressedNumber}`
  }

  chooseOperators(operation) {
    //previousに文字があったら計算を実行
    if (this.previousOperand !== '') {
      this.startCalculate()
    }
    this.operation = operation
    //算術記号が押されたら文字として格納されている数値をcurrentからpreviousに代入する
    this.previousOperand = this.currentOperand
    //currentを空にする
    this.currentOperand = ''
  }

  startCalculate() {
    let result =''
    //計算できるように文字列を数値型に変更
    const last = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    //previousとcurrent両方に数値がないと実行しない
    if (isNaN(last) || isNaN(current)) {return result}
    if(this.operation==='+') {result = last + current} 
    if(this.operation==='-')  {result = last - current}
    if(this.operation==='×')  {result = last * current}
    if(this.operation==='÷')  {result = last / current}
    //current(入力された数値表示する変数)に計算結果を代入
    this.currentOperand = result
    //算術記号を再び未定義に
    this.operation = undefined
    //previousも空文字にする
    this.previousOperand = ''
  }

  getScreenNumber(PressedNumber) {
    //文字列をobject型にする
    const stringNumber = PressedNumber.toString()
    //整数部分を表示
    const integer = parseFloat(stringNumber.split('.')[0])
    //少数部分を表示ここでは小数点の後の数値とつなげて文字として表示させる
    const decimalDigits = stringNumber.split('.')[1]
    let intergerScreen =''
    if (Number.isFinite(integer)) {
      //入力された整数部分を代入
      intergerScreen = integer
    } 
    if (decimalDigits===undefined) {
      //入力された整数部分がreturnになる
      return intergerScreen
    } else {
      //少数が入力された場合は整数とappendする
      return `${intergerScreen}.${decimalDigits}`
    }
    
  }

  updateDisplay() {
    this.currentOperandTextElement.textContent =
      this.getScreenNumber(this.currentOperand)
      console.log(this)
    if (this.operation ===undefined) {
      //算術記号が押されてない状態ではpreviousは常に空にしておく
      this.LastOperandTextElement.textContent = ''
    } else {
      //算術記号が押されている状態ではpreviousとoperationを1つの文字にしておく
      this.LastOperandTextElement.textContent =
        `${this.getScreenNumber(this.previousOperand)} ${this.operation}`
    }
  }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operator]')
const equalsButton = document.querySelector('[data-equal]')
const percentButton = document.querySelector('[data-percent]')
const backspaceButton = document.querySelector('[data-back-space]')
const allClearButton = document.querySelector('[data-all-clear]')
const LastOperandTextElement = document.querySelector('[data-lastoperatorand]')
const currentOperandTextElement = document.querySelector('[data-currentoperator]')

const calculator = new Calculator(LastOperandTextElement, currentOperandTextElement)

numberButtons.forEach(btn => {
  btn.addEventListener(calculator.eventtype(), () => {
   calculator.appendNumber(btn.textContent)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(btn => {
  btn.addEventListener(calculator.eventtype(), () => {
    calculator.chooseOperators(btn.textContent)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener(calculator.eventtype(), ()=> {
  calculator.startCalculate()
  calculator.updateDisplay()
})

allClearButton.addEventListener(calculator.eventtype(), () => {
  calculator.allclear()
  calculator.updateDisplay()
})

backspaceButton.addEventListener(calculator.eventtype(), () => {
  calculator.backspace()
  calculator.updateDisplay()
})

percentButton.addEventListener(calculator.eventtype(), () => {
  calculator.percent()
  calculator.updateDisplay()
})






