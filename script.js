const ip = "111.111.00.00" // exemplo

const mascara = 24 //exemplo

const qtd_sudrede = 2 // exemplo


const tableContainer = document.getElementById('table-container')




function divide_ip(ip){ //separa o ip nos decimais, tirando os pontos
    let list = ip.split('.')
    return list
}

function converte_binario(decimal){ //converte um numero decimal para binario
    decimal = parseInt(decimal)
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
    let decimal = 0
    let n = 7
    for (let i = 0; i < 8; i++){
        decimal += (2 ** i) * binario[n]
        n -= 1
    }
    return decimal
}


function broadcast(ip, mascara){
    mascara = parseInt(mascara)

    let ip_dividido = divide_ip(ip)
    let ip_binario = []
    let ip_concatenado = []

    for (let i = 0; i < 4; i++){
        ip_binario.push(converte_binario(ip_dividido[i]))
    }
    ip_concatenado = ip_binario[0].concat(ip_binario[1], ip_binario[2], ip_binario[3])

    for (let i = mascara; i < 32; i++){
        ip_concatenado[i] = 1
    }

    ip_binario = []
    for (let i = 0; i < 32; i += 8) {
        const dividido = ip_concatenado.slice(i, i + 8)
        ip_binario.push(dividido)
    }
    ip_dividido = []

    for (let i = 0; i < 4; i++){
        ip_dividido.push(converte_decimal(ip_binario[i]))
    }
    return ip_dividido
}
console.log(broadcast(ip, mascara)) // -------------------------------------

function sub_rede(ip, mascara, qtd_sudrede){
    const matriz = [["subrede", "primeiro endereço", "ultimo endereço", "mascara"]]
    qtd_sudrede = parseInt(qtd_sudrede)
    let primeiro_ip = ip
    let ultimo_end = ""
    let broadcast = []
    linha = []

    for (let i = 1; i <= qtd_sudrede; i ++) {
        linha.push(i)
        linha.push(primeiro_ip)
        broadcast = broadcast(ip, mascara)

        if (parseInt(broadcast[3]) == 0){
            
        }

        ultimo_end = `${broadcast[0]}.${broadcast[1]}.${broadcast[2]}.${parseInt(broadcast[3])-1}`
        
        if (parseInt(broadcast[3]) == 255)

    }
}


const matriz = [
    ["Header 1", "Header 2", "Header 3"],
    ["Row 1, Cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
    ["Row 2, Cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
    ["Row 3, Cell 1", "Row 3, Cell 2", "Row 3, Cell 3"]
];

function cria_tabela(matriz) {
    const tabela = document.createElement('table')
    tabela.border = "1"

    matriz.forEach((linha_matriz, linha_index) => {
        const linha = document.createElement('tr')

        linha_matriz.forEach((cellData) => {
            const celula = linha_index === 0 ? document.createElement('th') : document.createElement('td')
            celula.textContent = cellData
            linha.appendChild(celula)
        });

        tabela.appendChild(linha)
    });

    return tabela
}



const table = cria_tabela(matriz);

tableContainer.appendChild(table);