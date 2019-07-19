启用Ganache：
ganache-cli -a 20 -m "draft ketchup alien hobby crowd vague tennis arch ice paper often bachelor" --db "D:\VueTruffle\database" -p 8546

Truffle 部署合约：
Truffle v4.1.14 (core: 4.1.14)
Solidity v0.4.24 (solc-js)
truffle compile
truffle migrate --network ganache_cli


测试用账号：
(0) 0xd606cc37dea5f3590373c5cb2a1ab1ee1bef81b6 (~100 ETH)
(1) 0x769a020798c63a630c8faa925573b37273835231 (~100 ETH)
(2) 0x93add46147d63d2a2073439505bd04b8c12c6147 (~100 ETH)
(3) 0xfaa26a2fa5a702940a6e97d8ba340fb2221a2145 (~100 ETH)
(4) 0x4a21cc525e3605f89424ac0c9843dc25baf43ffa (~100 ETH)
(5) 0x1fe303b3eaca11e859f7761c390f97f86be2035e (~100 ETH)
(6) 0xbc516d269aa9faa530eec69af55e5ccfdb8b6dfd (~100 ETH)
(7) 0x9b321bb047dc2702dd1c5221e4747ded33a7fa1d (~100 ETH)
(8) 0x284196720d19821652f0e9c0832f1089d39634b2 (~100 ETH)
(9) 0x1e21145bb67690c73d950dfa8b84733fdbe9a176 (~100 ETH)
(10) 0x3268f4adaa10e10f17f87ad1a0e047ff498f6e6d (~100 ETH)
(11) 0x85076b2d583fed131854c0c539797cc6a3104810 (~100 ETH)
(12) 0x984560be5e96cf6fb9941076aae09bcd82695465 (~100 ETH)
(13) 0xc308854ce7167c05984a82a9a100f54df71a1c78 (~100 ETH)
(14) 0xaeb3fb9ff48af79b4fde5574b008706fea1291cd (~100 ETH)
(15) 0x7469cfecf23d60165d5b2cec8225566e6e1dc91a (~100 ETH)
(16) 0xb802b98741f0bd79d0edbfe8e783c41d79ae3d73 (~100 ETH)
(17) 0xc4723b41646ceb70f3d3152bd338342bf57dad64 (~100 ETH)
(18) 0xd579368f1a80adb14450c3928f47e49e4fca87fe (~100 ETH)
(19) 0xa00d0bef46ee223e87bfbfdd5aae1d8827aaf980 (~100 ETH)

使用Truffle部署合约后，在根目录/Solidity/下创建eproject_abi.js并根据以下方法载入合约信息


const projectaddress='0x8bd8e13275cdabac17da439f24a61c6c19980460';
//以实际情况为准

const projectABI={
.....
}
//在编译并部署完成后自动产生的Build文件夹中可找到

var projectconfig={
  "projectaddress":projectaddress,
  "projectABI":projectABI
}

module.exports = projectconfig;


改动情况：
truffle.js
配置以太坊节点接口时使用，决定了部署合约时，--network 后接的网络名

solidity/
eproject_abi.js（创建方法已在上文述及）

service/
project-xxxx.js
（项目部分的数据库建表）
支付记录表为project-paymentrecord.js

routes/
project.js
（项目部分的API接口路由，API接口路由统一以/api/project/xxxxx/xxxxx）命名）

migrations/
供Truffle部署合约使用，无需进行调整

ethereum/
提供调用合约函数的接口、初始化Web3实例、合约实例的相关函数库

contracts/
合约代码

config/
对数据库配置文件稍作修改，可无视

service/
controller/
添加了项目模块中控制层、服务层的相应代码

app.js
导入项目模块路由，以太坊交互接口、合约实例交互接口初始化
在正式部署时，应把app.js中的下列对应代码注！释！
app.get('/api/chguser',(req,res)=>{
    req.session.userID=req.query.userID;
    req.session.level=req.query.accessLevel
    res.json({userID:req.session.userID,accessLevel:req.session.level});
  });

