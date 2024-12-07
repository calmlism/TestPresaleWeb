var web3;

async function IsMetamaskAvailable() {
    if (window.ethereum) return true;
    return false;
}

async function EnableEthereum() {
    // const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // ethereum.autoRefreshOnNetworkChange = false;
    await ethereum.enable();

}

async function GetSelectedAddress() {
    return await ethereum.selectedAddress;
}

async function GetChainId() {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    return chainId;
}


async function SwitchChainID(chainID, chainName, chainRpcUrls, blockExplorerUrls, coinName, coinSymbol, coinDecimals) {

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainID }],
        });

        return true;
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: chainID,
                            chainName: chainName,
                            rpcUrls: [chainRpcUrls],
                            blockExplorerUrls: [blockExplorerUrls],
                            nativeCurrency: {
                                name: coinName,
                                symbol: coinSymbol,
                                decimals: parseInt(coinDecimals)
                            }
                        },
                    ],
                });
                return true;
            } catch (addError) {
                return false;
            }
        }
        return false;
    }
}


async function getPresaleLimit() {
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var nums = await presaleContract.methods.PRESALE_LIMIT().call();
    return web3.utils.fromWei(nums);
}

async function getTotal() {
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var nums = await presaleContract.methods.total().call();
    return web3.utils.fromWei(nums);
}

async function getTokenTotal() {
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var nums = await presaleContract.methods.CLAIM_TOKEN_TOTAL().call();
    return web3.utils.fromWei(nums);
}

async function queryUserInfo() {
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var address = await GetSelectedAddress();
    var info = await presaleContract.methods.queryUser(address).call();
    return info;
}

async function getTokenAmount() {
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var address = await GetSelectedAddress();
    var nums = await presaleContract.methods.getTokenAmount(address).call();
    return web3.utils.fromWei(nums);
}

async function getPageBuyDesc(_top){
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var buyCount = await presaleContract.methods.buyAddressCount().call();
    var infoArray = await presaleContract.methods.getPageBuyDesc(buyCount,_top).call();
    return infoArray;
}

async function getPageLuckyDesc(_top){
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var luckyCount = await presaleContract.methods.luckyAddressCount().call();
    var infoArray = await presaleContract.methods.getPageLuckyDesc(luckyCount,_top).call();
    return infoArray;
}

async function getFirstPrizeAddress(){
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    
    var info = await presaleContract.methods.firstPrizeAddress().call();
    return info;
}

async function getSecondPrizeAddress(){
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    
    var info = await presaleContract.methods.secondPrizeAddress().call();
    return info;
}

async function getThirdPrizeAddress(){
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    
    var info = await presaleContract.methods.thirdPrizeAddress().call();
    return info;
}

async function getLastPrizeAddress(){
    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    
    var info = await presaleContract.methods.lastPrizeAddress().call();
    return info;
}

async function buyToken(_number){

    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    var fee = await presaleContract.methods.SINGLE_FEE().call();
    var feeAll = fee * _number;
    var address = await GetSelectedAddress();
    var _data = presaleContract.methods.buy(_number).encodeABI();

    var transactionParameters = {
        to: ContractAddress.presale,
        from: address,
        value: feeAll,
        data: _data
    };

    var _gasPrice = await web3.eth.getGasPrice();
    var _gasLimit;
    try {
        _gasLimit = await web3.eth.estimateGas(transactionParameters);
    } catch (e) {

        return {
            state: false,
            msg: e.message
        };
    }
    transactionParameters.gasLimit = web3.utils.toHex(_gasLimit);
    transactionParameters.gasPrice = web3.utils.toHex(_gasPrice);

    var hash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
    });

    return {
        state: true,
        msg: hash
    };
}


async function claimToken(){

    var presaleContract = new web3.eth.Contract(Presale_ABI, ContractAddress.presale);
    
    var address = await GetSelectedAddress();
    var _data = presaleContract.methods.claim().encodeABI();

    var transactionParameters = {
        to: ContractAddress.presale,
        from: address,
        value: "0x00",
        data: _data
    };

    var _gasPrice = await web3.eth.getGasPrice();
    var _gasLimit;
    try {
        _gasLimit = await web3.eth.estimateGas(transactionParameters);
    } catch (e) {
        return {
            state: false,
            msg: e.message
        };
    }
    transactionParameters.gasLimit = web3.utils.toHex(_gasLimit);
    transactionParameters.gasPrice = web3.utils.toHex(_gasPrice);

    var hash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
    });

    return {
        state: true,
        msg: hash
    };
}
