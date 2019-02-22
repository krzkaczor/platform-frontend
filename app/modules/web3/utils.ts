import * as Eip55 from "eip55";
import * as Web3Utils from "web3-utils";
import BigNumber from "bignumber.js";

import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";

export function makeEthereumAddressChecksummed(
  ethereumAddress: EthereumAddress,
): EthereumAddressWithChecksum {
  return toChecksumAddress(ethereumAddress) as EthereumAddressWithChecksum;
}

export function ethereumNetworkIdToNetworkName(networkId: EthereumNetworkId): string {
  switch (networkId) {
    case "0":
      return "Dev";
    case "1":
      return "Mainnet";
    case "2":
      return "Morden";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    default:
      return "Unknown";
  }
}

export const validateAddress = (value: string) => value && isAddress(value.toUpperCase());

export const doesUserHaveEnoughEther = (//fixme
  value: string,
  maxEther: BigNumber,
): boolean => {
  if (value === "") return false;
  return new BigNumber(value || "0").lte(maxEther);
};
