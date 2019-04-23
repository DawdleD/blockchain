import Web3 from 'web3'
import {eprojectaddress, eprojectABI} from './constant/eproject_abi'
import {emarkaddress,emarkABI} from './constant/emark_abi'
import {store} from '../store/'

let getContract = new Promise(function(resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider);
  let ecourseContractInstance =  new web3.eth.Contract(eprojectABI, eprojectaddress);
  if (!ecourseContractInstance) {
    reject("no contract instance build")
  }
  resolve([ecourseContractInstance]);
});
export default getContract