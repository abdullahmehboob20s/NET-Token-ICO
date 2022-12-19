import tokenData from "./goerli/New_token.json";
import CrowdsaleData from "./goerli/Crowdsale.json";

const contractsData = {
  goerli: {
    NetTokenContractData: {
      address: tokenData.address,
      abi: tokenData.abi,
    },
    CrowdsaleContractData: {
      address: CrowdsaleData.address,
      abi: CrowdsaleData.abi,
    },
  },
};

export default contractsData;
