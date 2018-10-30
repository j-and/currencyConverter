var dateDisplay = document.querySelector('h4');
var d = new Date();
dateDisplay.textContent = (
	("00" + (d.getMonth() + 1)).slice(-2) + "/" + 
	("00" + d.getDate()).slice(-2) + "/" + 
		    d.getFullYear() /*+ " " + 
		    ("00" + d.getHours()).slice(-2) + ":" + 
		    ("00" + d.getMinutes()).slice(-2) + ":" + 
		    ("00" + d.getSeconds()).slice(-2)
		    */
		    );

var filterInt = function (value) {
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value) && value >= 0)
		return Number(value);
	else alert("Некорректно значение!")
		return value = 0;
}

var index;
var amount=document.getElementById("first").value;
var currency=document.getElementById('currency-select-two').value;
var requestCurrency=document.getElementById('currency-select-one').value;

function getInputValue(){
	return amount;
}

function setInputValue(inputId){
	amount=document.getElementById(inputId).value;
	if(inputId=='first'){
		setSelectValue('currency-select-one','currency-select-two');
	}
	else{
		setSelectValue('currency-select-two','currency-select-one');
	}
}

var output;

function setSelectValue(inputId,outputId){
	requestCurrency=document.getElementById(inputId).value;
	currency=document.getElementById(outputId).value;
	if(inputId=='currency-select-one'){
		amount=document.getElementById("first").value;
	}
	else{
		amount=document.getElementById("second").value;
	}
}

function getRequestCurrency(){
	return requestCurrency;
}

function getCurrency(){
	return currency;
}

function handleChenge(outputId){
	amount=getInputValue();
	currency=getCurrency();
	requestCurrency=getRequestCurrency();
	convertMoney(amount,outputId);
}

function setOutputValue(value,outputId){
	document.getElementById(outputId).value=value;
}

function convertMoney(amount,outputId){
		//alert('requestCurrency='+requestCurrency+'; currency='+currency+'; amount'+amount)
	var inputIndex=	getRate(requestCurrency);
	var outputIndex=getRate(currency);

	if(requestCurrency==='BYN'){
		if(currency==='BYN'){
			var value=(1*amount).toFixed(4);
			setOutputValue(value,outputId);
		}
		else{
			getValue(outputIndex).then(function (requestRes){
				var value=(amount/requestRes).toFixed(4);
				setOutputValue(value,outputId);
			})
		}
	}
	else if(currency==='BYN'){
			getValue(inputIndex).then(function (requestRes){
				var value=(amount*requestRes).toFixed(4);
				setOutputValue(value,outputId);
			})

		}
		else{

			getValue(inputIndex).then(function (res){
				getValue(outputIndex).then(function (requestRes){
					var value=(res/requestRes*amount).toFixed(4);
					setOutputValue(value,outputId);
				})
			})
		}

	}

	function getRate(currency){
		switch(currency) {
			case 'USD':  index=4;break;
			case 'EUR':    index=5;break;
			case 'RUB':    index=16;break;
			case 'UAH':    index=11;break;
			case 'PLN':    index=6;break;
			default:   index=4;break;
		} 
		return index;
	}


	function getValue(index) {
		result =  fetch('https://www.nbrb.by/API/ExRates/Rates?Periodicity=0')

		.then(res => res.json())
		.then(function(data) {
			res=scaleValue(data[index]);
			return res;
		})
		.catch(e => {
			return e;
		});
		return result;
	}


	function scaleValue(objValue) {
		return objValue.Cur_OfficialRate/objValue.Cur_Scale;
	}

	function clearInputs(){
		document.getElementById("first").value='';
		document.getElementById("second").value='';
	}