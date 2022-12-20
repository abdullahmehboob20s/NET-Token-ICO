import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useProvider,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import crowdsaleContractDetails from "../contractDetails/goerli/Crowdsale.json";
import tokenContractDetails from "../contractDetails/goerli/New_token.json";

const crowdsaleContract = {
  address: crowdsaleContractDetails.address,
  abi: crowdsaleContractDetails.abi,
};

const tokenContract = {
  address: tokenContractDetails.address,
  abi: tokenContractDetails.abi,
};

function ContractInteractor() {
  const { address } = useAccount();
  const [value, setValue] = useState(1);

  const { data: rateData, isSuccess: isRateFetched } = useContractRead({
    ...crowdsaleContract,
    functionName: "rate",
  });

  const { data: tokenSymbol, isSuccess: isTokenSymbolFetched } =
    useContractRead({
      ...tokenContract,
      functionName: "symbol",
    });

  const {
    write: buyTokens,
    isSuccess: isTokenBought,
    isLoading: isBuyingTokensLoading,
    error: tokenBuyingError,
    data: buyTokensData,
  } = useContractWrite({
    ...crowdsaleContract,
    functionName: "buyTokens",
    args: [address],
    overrides: {
      value: ethers.utils.parseEther("1"),
    },
    onSuccess: (data) => {
      toast("TX sent", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
        theme: "dark",
        type: "info",
      });

      data
        .wait(1)
        .then((res) => {
          toast("Tokens Bought Succesfully", {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
            type: "success",
          });
        })
        .catch(() => {
          toast("Unexpected error", {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
            theme: "dark",
            type: "error",
          });
        });
    },
    onError: (error, abc) => {
      if (error.message.includes("insufficient funds")) {
        toast("Insufficient Funds", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          type: "error",
        });
      } else {
        toast("Unknown Error, See console", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
          theme: "dark",
          type: "error",
        });
      }
      console.log("buytokens error: ", error);
    },
  });

  const {
    data,
    isError,
    isLoading: isWaitingForBuyingToken,
    isSuccess: isWaitOver,
  } = useWaitForTransaction({
    hash: buyTokensData?.hash,
  });

  const submitForm = (e) => {
    e.preventDefault();

    buyTokens({
      recklesslySetUnpreparedArgs: [address],
      recklesslySetUnpreparedOverrides: {
        value:
          ethers.utils.parseEther(value.toString()) ||
          ethers.utils.parseEther("1"),
      },
    });
  };

  return (
    <div>
      <div>
        {isRateFetched && isTokenSymbolFetched ? (
          <>
            <h2>GET</h2>
            <h3 style={{ color: "green" }}>
              {rateData.toString()} {tokenSymbol} (tokens) per Ether
            </h3>
          </>
        ) : null}

        <br />

        <form onSubmit={submitForm}>
          <label htmlFor="etherValue">Ether:</label>
          <input
            value={value}
            step="any"
            onChange={(e) => setValue(e.target.value)}
            disabled={isBuyingTokensLoading ? true : false}
            type="number"
            id="etherValue"
            placeholder="1 Ether"
          />
          <button disabled={isBuyingTokensLoading ? true : false} type="submit">
            Buy Tokens
          </button>
        </form>
        <br />
        {buyTokensData && isWaitingForBuyingToken ? (
          <>
            <p> Mining TX {buyTokensData?.hash} .....</p>
            <a
              href={`https://goerli.etherscan.io/tx/${buyTokensData?.hash}`}
              target="_blank"
            >
              view on etherscan
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ContractInteractor;
