import contractsData from "contractDetails/contractsData";
import { ethers } from "ethers";
import React from "react";
import { useAccount, useContractRead } from "wagmi";

function BoughtTokens() {
  const { address } = useAccount();
  const {
    data: tokenBalance,
    isLoading: tokenBalanceLoading,
    isSuccess: tokenBalanceLoaded,
  } = useContractRead({
    address: contractsData.goerli.NetTokenContractData.address,
    abi: contractsData.goerli.NetTokenContractData.abi,
    watch: true,
    args: [address],
    functionName: "balanceOf",
  });

  return (
    <div>
      {tokenBalanceLoaded && (
        <h2>Tokens : {ethers.utils.formatEther(tokenBalance)} NET</h2>
      )}
    </div>
  );
}

export default BoughtTokens;
