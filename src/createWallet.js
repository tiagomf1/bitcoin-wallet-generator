//Importando dependências:
const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

//Redes Bitcoin

// [!] Produção [!]
const main_network = bitcoin.networks.bitcoin
const main_network_id=0

// Testes
const test_network = bitcoin.networks.test_network
const test_network_id=1

// Lendo parâmetros da chamada do script
const args = process.argv.slice(2);

// Acessando parâmetros e validação
const network_param = args[0];
const wallets_quantity_param = args[1];



// Validanção da rede bitcoin
var network=""
var network_ID=""
switch(network_param){
    case "main":
    network = main_network
    network_ID = main_network_id    
    break;

    case "test":
    network = test_network
    network_ID = test_network_id   
    break;

    default:
    // Exibe todos os parâmetros
    console.log('Parâmetros Informados:', args);
    console.log("O primeiro parâmetro é a rede bitcoin e deve ser informado: main ou test")
    process.exit(1);
}

// Validação da quantidade de Wallets a serem geradas
var wallets_quantity=""
if(wallets_quantity_param > 0){
wallets_quantity = wallets_quantity_param
}else{
console.log('Parâmetros Informados:', args);
console.log("O segundo parâmetro é a quantidade de wallets a serem geradas, informe um número maior que zero.")
process.exit(2);
}




// derivação de carteira hierarquical deterministic HD
const path = `m/49'/`+network_ID+`'/0'/0`

//Criando palavras de recuperação da carteira
let mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic)

console.log("--------------[!]-------------")
console.log("Seed das carteiras geradas: ")
console.log(mnemonic)
console.log("--------------[!]-------------")
console.log()
//Criação da raiz da carteira
let root = bip32.fromSeed(seed,network)

//Criação de Private e Public Key da wallet
let account = root.derivePath(path)

for (i=0;i<wallets_quantity;i++){
let node = account.derive(0).derive(i)

let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
}).address

console.log("------------------ Carteira "+(i+1)+" gerada -------------------")
console.log("Endereço: ")
console.log(btcAddress)
console.log("Chave Privada: ")
console.log(node.toWIF())
console.log("--------------------------------------------------------")
console.log("")
}