function Calculator(){
    let operand1 = '';
    let operand2 = '';
    let operation;
    
    function setOperand1(_operand1){
        if(operand1.length < 12){
            operand1 += _operand1;
        }        
    };

    function setOperand2(_operand2){
        if(operand2.length < 12){
            operand2 += _operand2;
        }        
    };

    function setOperation(_operation){
        operation = _operation;
    };

    function getResult(){
        let result;
        operand1 = Number(operand1);
        operand2 = Number(operand2);
        if (operand1 === undefined){
            console.log("Insira o primeiro valor.");
            return "ERROR"
        } else if (operation == ''){
            console.log("Insira a operação.");
            return "ERROR"
        } else if (operand2 === undefined){
            console.log("Insira o segundo valor.");
            return "ERROR"
        } else if (operation == "soma"){
            result = operand1 + operand2;
        } else if (operation == "subtracao"){
            result = operand1 - operand2;
        } else if (operation == "multiplicacao"){
            result = operand1 * operand2;
        } else if (operation == "divisao"){
            if (operand2 == 0){
                console.log("Não é possível divisão por zero.");
                return "ERROR"
            } else {
                result = operand1 / operand2;    
            }   
        }
        if (typeof result == 'number'){
            result = result.toString();
            if (result.length > 11){
                return "TOO BIG";
            } else {
                operand1 = result;
                operand2 = "";
                operation = "";
                return result;
            }
        }
    };

    function clearCalculator(){
        operand1 = "";
        operand2 = "";
        operation = "";
    };
    return {
        setOperand1,
        setOperand2,
        setOperation,
        getResult,
        clearCalculator,
    }
}

const calculadora = new Calculator();

let displayPosition = 0;
let operandNumber = 1;
let hasOperand = false;
let operandArray =[];
let equalEnabled = false;
let hasDot = false; // testing

$(".botaoNumero").click(function(){
    if (operandNumber == 1){
        calculadora.setOperand1(this.value);
    } else {
        calculadora.setOperand2(this.value);
        equalEnabled = true;
    }
    if(displayPosition < 12){
        operandArray.push(this.value);
        operandArray.reverse();
        for (let i = 0; i<operandArray.length; i++){
            $(`#display-digit${i}`).html(operandArray[i]);
        }
        operandArray.reverse();
        displayPosition ++;
    }
    hasOperand = true;
});

$(".botaoOperador").click(function(){
    if(hasOperand){
        $(".displayDigit").html('');
        displayPosition = 0;
        calculadora.setOperation(this.id);
        $("#display-digit0").html(this.value);
        hasOperand = false;
        operandNumber = 2;
        operandArray =[];
    }
});

$("#apagaTudo").click(function(){
    $(".displayDigit").html('');
    displayPosition = 0;
    hasOperand = false;
    operandNumber = 1;
    operandArray =[];
    calculadora.clearCalculator();
});

$("#botaoIgual").click(function(){
    if (equalEnabled){
        let result = calculadora.getResult();
        let splitResult = result.split("");
        splitResult.reverse();
        result = splitResult.join("");
        for (let i = 0; i<result.length; i++){
            $(`#display-digit${i}`).html(result[i]);
        }
        displayPosition = 0;
        operandNumber = 1;
        hasOperand = true;
        operandArray =[];
        equalEnabled = false;
    }
});