document.getElementById('calculateBtn').addEventListener('click', function() {
    const ip = document.getElementById('ipAddress').value;
    const mascara = document.getElementById('subnetMask').value;
    const qtd_sudrede = document.getElementById('subnetCount').value;
    var texto = document.getElementById('error')
    if (ip != "" && mascara != "" && qtd_sudrede != "" && mascara <=32 && mascara > 0) {
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = ''; // Limpa o conteúdo anterior
        const table = cria_tabela(sub_rede(ip, mascara, qtd_sudrede));
        tableContainer.appendChild(table);

        document.getElementById('container').style.display = 'none';
        document.getElementById('resultContainer').style.display = 'flex';
        texto.textContent = ""
    } else {
        texto.textContent = "Os dados estão incorretos"
    }
        
});

document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('resultContainer').style.display = 'none';
    document.getElementById('container').style.display = 'block';
});

/** 
 * Separa string do ip em um array.
 * 
 * @param {strring} ip - ip para separação.
 * @return {array} ip dividido no array.
*/
function divide_ip(ip) { 
    var texto = document.getElementById('error')
    let list = ip.split('.');
    if (list.length != 4){
        texto.textContent = "Ip invalido";
        return "erro"
    }
    for (let i = 0; i < list.length; i++) {
        const num = parseInt(list[i]);
        if (isNaN(num) || num < 0 || num > 255) {
            texto.textContent = "Ip invalido";
            return "erro";
        }
        list[i] = num;
    }

    return list;
}   

/**
 * Converte um numero decimal para binario.
 * 
 * @param {*} decimal - decimal para conversão.
 * @returns {array} numero convertido para binario.
 */
function converte_binario(decimal) { 
    decimal = parseInt(decimal);
    let binario = [];
    for (let i = 0; i < 8; i++) {
        if (decimal % 2 == 0){
            binario.unshift(0);
        }else{
            binario.unshift(1);
        }
        decimal = Math.floor(decimal/2);
    }
    return binario;
}

/**
 * Converte um numero decimal para decimal.
 * 
 * @param {array} binario  - Array com numero binario para ser convertido.
 * @returns {number} numero convertido para decimal.
 */
function converte_decimal(binario) { 
    let decimal = 0;
    let n = 7;
    for (let i = 0; i < 8; i++){
        decimal += (2 ** i) * binario[n];
        n -= 1;
    }
    return decimal;
}

/**
 * Recebe o primeiro endereço e encontra o ultimo endereço.
 * 
 * @param {string} ip - primeiro endereço.
 * @param {*} mascara - mascara.
 * @returns {string} ultimo endereço.
 */
function encontra_broadcast(ip, mascara) { 
    mascara = parseInt(mascara);

    let ip_dividido = divide_ip(ip);
    if(ip_dividido == "erro"){
        return
    }
    let ip_binario = [];
    let ip_concatenado = [];

    for (let i = 0; i < 4; i++){
        ip_binario.push(converte_binario(ip_dividido[i]));
    }
    ip_concatenado = ip_binario[0].concat(ip_binario[1], ip_binario[2], ip_binario[3]);

    for (let i = mascara; i < 32; i++){
        ip_concatenado[i] = 1;
    }

    ip_binario = [];
    for (let i = 0; i < 32; i += 8) {
        const dividido = ip_concatenado.slice(i, i + 8);
        ip_binario.push(dividido);
    }
    ip_dividido = [];

    for (let i = 0; i < 4; i++){
        ip_dividido.push(converte_decimal(ip_binario[i]));
    }
    return ip_dividido;
}

/**
 * Cria uma matriz contendo todos os primeiro e ultimos endereços.
 * 
 * @param {string} ip - ip recebido do usuario.
 * @param {*} mascara - mascara recebido pelo usuario.
 * @param {*} qtd_sudrede - quantidades de subredes recebido pelo usuario.
 * @returns {array} matriz para criação da tabela.
 */
function sub_rede(ip, mascara, qtd_sudrede) { 
    var texto = document.getElementById('error')
    let matriz = [["subrede", "primeiro endereço", "ultimo endereço", "mascara"]];
    qtd_sudrede = parseInt(qtd_sudrede);
    if (mascara != parseInt(mascara)) {
        texto.textContent = "Mascara tem que ser inteira"
        return "erro"
    }
    mascara = encontra_mascara(mascara, qtd_sudrede)
    let primeiro_ip = ip;
    let ultimo_end = "";
    let broadcast = [];

    for (let i = 1; i <= qtd_sudrede; i ++) {
        let linha = [];

        linha.push(i);
        linha.push(primeiro_ip);
        broadcast = encontra_broadcast(primeiro_ip, mascara);

        ultimo_end = `${broadcast[0]}.${broadcast[1]}.${broadcast[2]}.${broadcast[3]}`;
        linha.push(ultimo_end);
        linha.push(mascara);
        matriz.push(linha);
        if (parseInt(broadcast[3]) == 255){
            broadcast[3] = 0;
            if (parseInt(broadcast[2]) == 255){
                broadcast [2] = 0;
                if (parseInt(broadcast[1]) == 255){
                    broadcast[1] = 0;
                    if (parseInt(broadcast[0]) != 255){
                        broadcast[0] = parseInt(broadcast[0]) + 1;
                    }
                }else {
                    broadcast[1] = parseInt(broadcast[1]) + 1;
                }
            }else {
                broadcast[2] = parseInt(broadcast[2]) + 1;
            }
        } else {
            broadcast[3] = parseInt(broadcast[3]) + 1;
        }

        primeiro_ip = `${broadcast[0]}.${broadcast[1]}.${broadcast[2]}.${broadcast[3]}`;
    }

    return matriz;
}

/**
 * Transforma a matriz em uma tabela contendo todas as subredes para visualização do usuario.
 * 
 * @param {array} matriz - matriz para ciar a tabela.
 * @returns - tabela ja construida.
 */
function cria_tabela(matriz) { 
    const tabela = document.createElement('table');
    tabela.border = "1";

    matriz.forEach((linha_matriz, linha_index) => {
        const linha = document.createElement('tr');

        linha_matriz.forEach((cellData) => {
            const celula = linha_index === 0 ? document.createElement('th') : document.createElement('td');
            celula.textContent = cellData;
            linha.appendChild(celula);
        });

        tabela.appendChild(linha);
    });

    return tabela;
}

/**
 * Encontra a mascara.
 * 
 * @param {*} mascara - mascara.
 * @param {*} qtd_sudrede - quantidade de subrede.
 * @returns {number} - mascara encontrada.
 */
function encontra_mascara(mascara, qtd_sudrede){
    mascara = parseInt(mascara)
    qtd_sudrede = parseInt(qtd_sudrede)
    mascara = 32 - mascara
    mascara = (2**mascara)/qtd_sudrede
    mascara = Math.ceil(Math.log2(mascara))
    mascara = 32 - mascara
    return mascara
}
console.log(encontra_mascara(26, 10))