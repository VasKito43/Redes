const ip = "111.111.00.00";


function divide_ip(ip){ //separa o ip nos decimais, tirando os pontos
    let list = ip.split('.')
    return list
}

function converte_binario(decimal){ //converte um numero decimal para binario
    let binario = []
    for (let i = 0; i < 8; i++) {
        if (decimal % 2 == 0){
            binario.unshift(0)
        }else{
            binario.unshift(1)
        }
        decimal = Math.floor(decimal/2)
    }
    return binario
}

function converte_decimal(binario){ //converte um numero binario para decimal

    return decimal
}
console.log(converte_binario(1))