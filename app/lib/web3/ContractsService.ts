import { inject, injectable } from "inversify";
import Web3 from "web3";

import { IConfig } from "../../config/getConfig";
import { symbols } from "../../di/symbols";
import { EtherToken } from "../contracts/EtherToken";
import { ETOCommitment } from "../contracts/ETOCommitment";
import { EuroToken } from "../contracts/EuroToken";
import { EuroTokenController } from "../contracts/EuroTokenController";
import { FeeDisbursal } from "../contracts/FeeDisbursal";
import { ICBMLockedAccount } from "../contracts/ICBMLockedAccount";
import { IControllerGovernance } from "../contracts/IControllerGovernance";
import { IdentityRegistry } from "../contracts/IdentityRegistry";
import { IEquityToken } from "../contracts/IEquityToken";
import { ITokenExchangeRateOracle } from "../contracts/ITokenExchangeRateOracle";
import { LockedAccount } from "../contracts/LockedAccount";
import { Neumark } from "../contracts/Neumark";
import { PlatformTerms } from "../contracts/PlatformTerms";
import { Universe } from "../contracts/Universe";
import { ILogger } from "../dependencies/logger";
import { Web3Manager } from "./Web3Manager";

import * as knownInterfaces from "../contracts/knownInterfaces.json";

@injectable()
export class ContractsService {
  private etoCommitmentCache: { [etoId: string]: ETOCommitment } = {};
  private equityTokensCache: { [equityTokenAddress: string]: IEquityToken } = {};
  private controllerGovernanceCache: { [tokenController: string]: IControllerGovernance } = {};
  private web3: Web3 | undefined;

  public universeContract!: Universe;
  public neumark!: Neumark;
  public euroToken!: EuroToken;
  public euroTokenController!: EuroTokenController;
  public etherToken!: EtherToken;

  public euroLock!: LockedAccount;
  public etherLock!: LockedAccount;
  public icbmEuroLock!: ICBMLockedAccount;
  public icbmEtherLock!: ICBMLockedAccount;
  public identityRegistry!: IdentityRegistry;
  public feeDisbursal!: FeeDisbursal;
  public platformTerms!: PlatformTerms;
  public rateOracle!: ITokenExchangeRateOracle;

  constructor(
    @inject(symbols.config) private readonly config: IConfig,
    @inject(symbols.web3Manager) private readonly web3Manager: Web3Manager,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {}

  public async init(): Promise<void> {
    this.logger.info("Initializing contracts...");

    this.web3 = this.web3Manager.internalWeb3Adapter.web3;

    if (!this.web3) {
      throw new Error("Could not initialize web3");
    }
    this.universeContract = (await create(
      Universe,
      this.web3,
      this.config.contractsAddresses.universeContractAddress,
    )) as Universe;
    debugger;
    const [
      neumarkAddress,
      euroLockAddress,
      etherLockAddress,
      icbmEuroLockAddress,
      icbmEtherLockAddress,
      euroTokenAddress,
      euroTokenControllerAddress,
      etherTokenAddress,
      tokenExchangeRateOracleAddress,
      identityRegistryAddress,
      platformTermsAddress,
      feeDisbursalAddress,
    ] = await this.universeContract.getManySingletons([
      knownInterfaces.neumark,
      knownInterfaces.euroLock,
      knownInterfaces.etherLock,
      knownInterfaces.icbmEuroLock,
      knownInterfaces.icbmEtherLock,
      knownInterfaces.euroToken,
      knownInterfaces.euroTokenController,
      knownInterfaces.etherToken,
      knownInterfaces.tokenExchangeRateOracle,
      knownInterfaces.identityRegistry,
      knownInterfaces.platformTerms,
      knownInterfaces.feeDisbursal,
    ]);

    [
      this.neumark,
      this.euroLock,
      this.etherLock,
      this.icbmEuroLock,
      this.icbmEtherLock,
      this.rateOracle,
      this.identityRegistry,
      this.platformTerms,
      this.euroToken,
      this.euroTokenController,
      this.etherToken,
      this.feeDisbursal,
    ] = await Promise.all<any>([
      create(Neumark, this.web3, neumarkAddress),
      create(LockedAccount, this.web3, euroLockAddress),
      create(LockedAccount, this.web3, etherLockAddress),
      create(ICBMLockedAccount, this.web3, icbmEuroLockAddress),
      create(ICBMLockedAccount, this.web3, icbmEtherLockAddress),
      create(ITokenExchangeRateOracle, this.web3, tokenExchangeRateOracleAddress),
      create(IdentityRegistry, this.web3, identityRegistryAddress),
      create(PlatformTerms, this.web3, platformTermsAddress),
      create(EuroToken, this.web3, euroTokenAddress),
      create(EuroTokenController, this.web3, euroTokenControllerAddress),
      create(EtherToken, this.web3, etherTokenAddress),
      create(FeeDisbursal, this.web3, feeDisbursalAddress),
    ]);

    this.logger.info("Initializing contracts via UNIVERSE is DONE.");
  }

  async getETOCommitmentContract(etoId: string): Promise<ETOCommitment> {
    if (this.etoCommitmentCache[etoId]) return this.etoCommitmentCache[etoId];

    const contract = await create(ETOCommitment, this.web3, etoId);
    this.etoCommitmentCache[etoId] = contract;
    return contract;
  }

  async getEquityToken(equityTokenAddress: string): Promise<IEquityToken> {
    if (this.equityTokensCache[equityTokenAddress])
      return this.equityTokensCache[equityTokenAddress];

    const contract = await create(IEquityToken, this.web3, equityTokenAddress);
    this.equityTokensCache[equityTokenAddress] = contract;
    return contract;
  }

  async getControllerGovernance(controllerAddress: string): Promise<IControllerGovernance> {
    if (this.controllerGovernanceCache[controllerAddress])
      return this.controllerGovernanceCache[controllerAddress];

    const contract = await create(IControllerGovernance, this.web3, controllerAddress);
    this.controllerGovernanceCache[controllerAddress] = contract;
    return contract;
  }
}

/**
 * Creates contract wrapper.
 * In dev mode it will validate contract code to ease web3 development pains. In prod it will assume that address is correct, saving some network calls.
 */
async function create<T>(ContractCls: IContractCls<T>, web3: Web3, address: string): Promise<T> {
  if (process.env.NODE_ENV === "production") {
    return new ContractCls(web3, address);
  } else {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: "tokenExchangeRateOracle",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "interfaceIds", type: "bytes4[]" },
          { name: "instance", type: "address" },
          { name: "set", type: "bool" },
        ],
        name: "setInterfaceInManyCollections",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "identityRegistry",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "forkArbiter",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "interfaceId", type: "bytes4" },
          { name: "instance", type: "address" },
          { name: "set", type: "bool" },
        ],
        name: "setCollectionInterface",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "euroToken",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "instance", type: "address" }],
        name: "getInterfacesOfInstance",
        outputs: [{ name: "interfaces", type: "bytes4[]" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "feeDisbursal",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "gasExchange",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "interfaceId", type: "bytes4" }],
        name: "getSingleton",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "interfaceId", type: "bytes4" }, { name: "instance", type: "address" }],
        name: "isInterfaceCollectionInstance",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "newPolicy", type: "address" },
          { name: "newAccessController", type: "address" },
        ],
        name: "setAccessPolicy",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "tokenExchange",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "interfaceIds", type: "bytes4[]" }],
        name: "getManySingletons",
        outputs: [{ name: "", type: "address[]" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "signatory", type: "address" }],
        name: "agreementSignedAtBlock",
        outputs: [{ name: "blockNo", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "icbmEuroLock",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "interfaceIds", type: "bytes4[]" }, { name: "instance", type: "address" }],
        name: "isAnyOfInterfaceCollectionInstance",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "amendmentsCount",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "contractId",
        outputs: [{ name: "id", type: "bytes32" }, { name: "version", type: "uint256" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "euroLock",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "amendmentIndex", type: "uint256" }],
        name: "pastAgreement",
        outputs: [
          { name: "contractLegalRepresentative", type: "address" },
          { name: "signedBlockTimestamp", type: "uint256" },
          { name: "agreementUri", type: "string" },
          { name: "index", type: "uint256" },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "interfaceIds", type: "bytes4[]" },
          { name: "instances", type: "address[]" },
        ],
        name: "setManySingletons",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "etherToken",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "platformTerms",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "currentAgreement",
        outputs: [
          { name: "contractLegalRepresentative", type: "address" },
          { name: "signedBlockTimestamp", type: "uint256" },
          { name: "agreementUri", type: "string" },
          { name: "index", type: "uint256" },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "interfaceId", type: "bytes4" }, { name: "instance", type: "address" }],
        name: "setSingleton",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "etherLock",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "neumark",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "ethereumForkArbiter",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "agreementUri", type: "string" }],
        name: "amendAgreement",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "interfaceId", type: "bytes4" }, { name: "instance", type: "address" }],
        name: "isSingleton",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "platformPortfolio",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "accessPolicy",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "icbmEtherLock",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "interfaceIds", type: "bytes4[]" },
          { name: "instances", type: "address[]" },
          { name: "set_flags", type: "bool[]" },
        ],
        name: "setCollectionsInterfaces",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { name: "accessPolicy", type: "address" },
          { name: "forkArbiter", type: "address" },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, name: "interfaceId", type: "bytes4" },
          { indexed: false, name: "instance", type: "address" },
          { indexed: false, name: "replacedInstance", type: "address" },
        ],
        name: "LogSetSingleton",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, name: "interfaceId", type: "bytes4" },
          { indexed: false, name: "instance", type: "address" },
          { indexed: false, name: "isSet", type: "bool" },
        ],
        name: "LogSetCollectionInterface",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, name: "controller", type: "address" },
          { indexed: false, name: "oldPolicy", type: "address" },
          { indexed: false, name: "newPolicy", type: "address" },
        ],
        name: "LogAccessPolicyChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: "accepter", type: "address" }],
        name: "LogAgreementAccepted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            name: "contractLegalRepresentative",
            type: "address",
          },
          { indexed: false, name: "agreementUri", type: "string" },
        ],
        name: "LogAgreementAmended",
        type: "event",
      },
    ];
    return (await new web3.eth.Contract(abi as any, address)) as any;
  }
}

// TODO: Move to TypeChain
interface IContractCls<T> {
  new (web3: any, address: string): T;
  createAndValidate(web3: any, address: string): Promise<T>;
}
