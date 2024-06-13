document.getElementById('calculateBtn').addEventListener('click', function() {
    const ip = document.getElementById('ipAddress').value;
    const mascara = document.getElementById('subnetMask').value;
    const qtd_sudrede = document.getElementById('subnetCount').value;
    var texto = document.getElementById('error')
    console.log(ip, mascara, qtd_sudrede)
    if (ip != "" && mascara != "" && qtd_sudrede != "") {
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

function divide_ip(ip) { 
    let list = ip.split('.');
    return list;
}

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

function converte_decimal(binario) { 
    let decimal = 0;
    let n = 7;
    for (let i = 0; i < 8; i++){
        decimal += (2 ** i) * binario[n];
        n -= 1;
    }
    return decimal;
}

function encontra_broadcast(ip, mascara) { 
    mascara = parseInt(mascara);

    let ip_dividido = divide_ip(ip);
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

function sub_rede(ip, mascara, qtd_sudrede) { 
    let matriz = [["subrede", "primeiro endereço", "ultimo endereço", "mascara"]];
    qtd_sudrede = parseInt(qtd_sudrede);
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
