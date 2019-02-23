import { expect } from "chai";
import * as sinon from "sinon";

import { setupFakeClock } from "../../../../test/integrationTestUtils";
import { IAppState } from "../../../store";
import { DeepPartial } from "../../../types";
import { EETOStateOnChain } from "../../public-etos/interfaces/interfaces";
import * as publicEtoSelectors from "../../public-etos/selectors";
import { selectBankTransferReferenceCode } from "../selectors";

function createStateWithAddress(address: string, reference: string): IAppState {
  const state: DeepPartial<IAppState> = {
    web3: { connected: true, wallet: { address } },
    investmentFlow: {
      bankTransferReference: reference,
    },
  };
  return state as IAppState;
}

describe("investment-flow > selectors", () => {
  setupFakeClock();

  describe("selectBankTransferReferenceCode", () => {
    beforeEach(() => {
      sinon.stub(publicEtoSelectors, "selectEtoOnChainStateById").returns(undefined);
    });

    afterEach(() => {
      (publicEtoSelectors.selectEtoOnChainStateById as sinon.SinonStub).restore();
    });

    it("generates a code from the address and gasprice", () => {
      const code1 = selectBankTransferReferenceCode(
        createStateWithAddress("0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3", "1234567890"),
      );
      const code2 = selectBankTransferReferenceCode(
        createStateWithAddress("0x6e9A689BF3E87F7fc945D345A869841787447a35", "abcdefghijklo"),
      );
      const code3 = selectBankTransferReferenceCode(
        createStateWithAddress("0x822060c96E012Bf88D08635A543210D1029b658D", "uzehdmdkeikskmm"),
      );
      expect(code1).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3 REF 1234567890",
      );
      expect(code2).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x6e9A689BF3E87F7fc945D345A869841787447a35 REF ABCDEFGHIJKLO",
      );
      expect(code3).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x822060c96E012Bf88D08635A543210D1029b658D REF UZEHDMDKEIKSKMM",
      );
    });

    it("adds a gas stipend appendix", () => {
      let state = createStateWithAddress(
        "0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3",
        "88888888888",
      );

      state = {
        ...state,
        investmentFlow: {
          ...state.investmentFlow,
          bankTransferGasStipend: true,
        },
      };

      const code = selectBankTransferReferenceCode(state);
      expect(code).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3 REF 88888888888 G",
      );
    });

    it("adds a whitelist appendix if eto state is Whitelist", () => {
      let state = createStateWithAddress(
        "0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3",
        "ddddddddddd",
      );

      (publicEtoSelectors.selectEtoOnChainStateById as sinon.SinonStub).returns(
        EETOStateOnChain.Public,
      );

      let code = selectBankTransferReferenceCode(state);
      expect(code).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3 REF DDDDDDDDDDD",
      );

      (publicEtoSelectors.selectEtoOnChainStateById as sinon.SinonStub).returns(
        EETOStateOnChain.Whitelist,
      );

      code = selectBankTransferReferenceCode(state);
      expect(code).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3 REF DDDDDDDDDDD WL",
      );

      state = {
        ...state,
        investmentFlow: {
          ...state.investmentFlow,
          bankTransferGasStipend: true,
        },
      };

      code = selectBankTransferReferenceCode(state);
      expect(code).to.equal(
        "Investment Amount, Reservation and Acquisition Agreement from 01-01-1970 NF 0x0061c60a6477bb64aEc5dc8d3C892cC53C8084a3 REF DDDDDDDDDDD G WL",
      );
    });
  });
});
