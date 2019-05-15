module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    live: {
      host: "localhost", //本地地址，因为是在本机上建立的节点
      port: 8545,        //Ethereum的rpc监听的端口号，默认是8545
      network_id: "*"// 自定义网络号
    },
    ganache_cli:{
      host:"localhost",
      port: 8546,
      network_id:"*",
    },
  }
};
