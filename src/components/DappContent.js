import BoughtTokens from "components/BoughtTokens";
import React from "react";
import {
  goerli,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useBalance,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import ContractInteractor from "components/ContractInteractor";
import TokenData from "contractDetails/goerli/New_token.json";
import AllTokensData from "./AllTokensData";

function DappContent() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { switchNetwork, isLoading: switchNetworkLoading } = useSwitchNetwork();
  const { disconnect, isLoading: disconnectLoading } = useDisconnect();
  const {
    connect,
    isLoading,
    status,
    error: connectError,
    isError: isConnectError,
  } = useConnect({
    chainId: goerli.id,
    connector: new InjectedConnector(),
  });
  const { data: balanceData, isSuccess: balanceLoaded } = useBalance({
    address: address ? address : null,
    watch: true,
  });

  if (isLoading || disconnectLoading || switchNetworkLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isConnected && chain?.id !== 5) {
    return (
      <div>
        <button onClick={() => switchNetwork(5)}>
          Switch Network to Goerli
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div>
        <button onClick={() => connect()} disabled={isLoading ? true : false}>
          Connect
        </button>
        {isConnectError && connectError.message === "Connector not found" ? (
          <p>
            Metamask not found,{" "}
            <a href="https://metamask.io/download/" target="_blank">
              download Metamask
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  if (isConnected) {
    return (
      <div>
        {/* <AllTokensData />
        <br />
        <br /> */}

        <p>Address: {address}</p>
        {balanceLoaded && (
          <p>
            Balance: {Number(balanceData.formatted).toFixed(2)}{" "}
            {balanceData.symbol}{" "}
          </p>
        )}
        <BoughtTokens />
        <p>Chain ID: {chain && chain.id}</p>

        <br />
        <button
          disabled={disconnectLoading ? true : false}
          onClick={() => disconnect()}
        >
          Disconnect
        </button>

        <br />
        <br />
        <p>
          Import <strong>NET</strong> Token : <b>{TokenData.address}</b>
        </p>
        <br />

        <ContractInteractor />
      </div>
    );
  }
}

export default DappContent;
