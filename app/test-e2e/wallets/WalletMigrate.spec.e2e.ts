import BigNumber from "bignumber.js";
import web3Accounts from "web3-eth-accounts";

import { appRoutes } from "../../components/appRoutes";
import { Q18 } from "../../config/constants";
import {
  charRegExPattern,
  FIXTURE_ACCOUNTS,
  letterKeepDotRegExPattern,
  letterRegExPattern,
} from "../utils";
import {
  ETransactionStatus,
  getChainIdRpc,
  getNonceRpc,
  getTransactionReceipt,
  sendRawTransactionRpc,
} from "../utils/ethRpcUtils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

const NODE_ADDRESS = "https://localhost:9090/node";

//this constant is hard coded!
const FIXTURE_DIV_CONSTANT = 100000000000000;

const ADDRESS = "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3";
describe("Wallet Migration Flow", () => {
  it("It should check icbm migration wallet when user has locked wallet", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
      seed:
        "then route cage lyrics arrange car pigeon gas rely canoe turn all weapon pepper lemon festival joy option drama forget tortoise useful canvas viable",
    }).then(() => {
      cy.visit(appRoutes.icbmMigration);
      cy.get(tid("models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget"));
    });
  });
  it("It will migrate an ICBM wallet into a new user", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      const privKeyHex = "0x79177f5833b64c8fdcc9862f5a779b8ff0e1853bf6e9e4748898d4b6de7e8c93";
      const account = new web3Accounts.Accounts("").privateKeyToAccount(privKeyHex);

      cy.visit("/profile");
      cy.get(tid("models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget.address")).type(
        ADDRESS + "{enter}",
      );
      // Assert that the values of NEU and ETHER are correct
      cy.get(tid("profile.modal.icbm-wallet-balance.neu-balance")).then(data => {
        const neuBalance = new BigNumber(FIXTURE_ACCOUNTS[ADDRESS].icbmEtherLockBalance[1])
          .div(FIXTURE_DIV_CONSTANT)
          .round();

        const ethBalance = new BigNumber(FIXTURE_ACCOUNTS[ADDRESS].icbmEtherLockBalance[0])
          .div(Q18)
          .round(4);

        cy.get(tid("profile.modal.icbm-wallet-balance.eth-balance")).then(ethData => {
          const walletEthBalance = new BigNumber(
            ethData.text().replace(letterKeepDotRegExPattern, ""),
          );
          const walletNeuBalance = new BigNumber(data.text().replace(letterRegExPattern, ""));

          expect(walletNeuBalance.equals(neuBalance)).to.be.true;
          expect(walletEthBalance.equals(ethBalance)).to.be.true;

          cy.get(tid("modals.icbm-balance-modal.balance-footer.generate-transaction"))
            .wait(2000)
            .click();
          cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(toField => {
            const to = toField
              .text()
              .replace(charRegExPattern, "")
              .split("Tosmartcontract")
              .pop();
            cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(gasLimitField => {
              const gas = gasLimitField
                .text()
                .replace(charRegExPattern, "")
                .split("Gaslimit")
                .pop();

              cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(
                inputDataField => {
                  const data = inputDataField
                    .text()
                    .replace(charRegExPattern, "")
                    .split("Data")
                    .pop();
                  getNonceRpc(NODE_ADDRESS, "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3").then(
                    nonce => {
                      getChainIdRpc(NODE_ADDRESS).then(chainId => {
                        (account as any)
                          .signTransaction({
                            to,
                            value: "0",
                            gas,
                            data,
                            gasPrice: "1",
                            nonce: nonce.body.result,
                            chainId: chainId.body.result,
                          })
                          .then((signed: any) => {
                            cy.log("Sending First Transaction");
                            sendRawTransactionRpc(NODE_ADDRESS, signed.rawTransaction).then(
                              hash => {
                                // Wait for transaction to get conducted
                                cy.wait(1000);
                                getTransactionReceipt(NODE_ADDRESS, hash.body.result).then(
                                  receipt => {
                                    cy.log("Sending First Transaction");
                                    // Check if the conducted transaction was successful
                                    expect(receipt.body.result.status).to.equal(
                                      ETransactionStatus.SUCCESS,
                                    );
                                    // Wait until transaction is success then click
                                    cy.get(
                                      tid(
                                        "modals.icbm-balance-modal.balance-footer.successful-transaction",
                                      ),
                                    ).awaitedClick();
                                    // Modal Should Detect The transaction and Transition to Step 2
                                    cy.get(tid("modals.icbm-balance-modal.migrate-body.step-2"));

                                    cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(
                                      toField => {
                                        const to = toField
                                          .text()
                                          .replace(charRegExPattern, "")
                                          .split("Tosmartcontract")
                                          .pop();
                                        cy.get(
                                          tid("modals.icbm-balance-modal.migrate-body.gas-limit"),
                                        ).then(gasLimitField => {
                                          const gas = gasLimitField
                                            .text()
                                            .replace(charRegExPattern, "")
                                            .split("Gaslimit")
                                            .pop();

                                          cy.get(
                                            tid(
                                              "modals.icbm-balance-modal.migrate-body.input-data",
                                            ),
                                          ).then(inputDataField => {
                                            const data = inputDataField
                                              .text()
                                              .replace(charRegExPattern, "")
                                              .split("Data")
                                              .pop();
                                            getNonceRpc(
                                              NODE_ADDRESS,
                                              "0x429123b08DF32b0006fd1F3b0Ef893A8993802f3",
                                            ).then(nonce => {
                                              getChainIdRpc(NODE_ADDRESS).then(chainId => {
                                                (account as any)
                                                  .signTransaction({
                                                    to,
                                                    value: "0",
                                                    gas,
                                                    data,
                                                    gasPrice: "1",
                                                    nonce: nonce.body.result,
                                                    chainId: chainId.body.result,
                                                  })
                                                  .then((signed: any) => {
                                                    sendRawTransactionRpc(
                                                      NODE_ADDRESS,
                                                      signed.rawTransaction,
                                                    ).then(hash => {
                                                      // Wait for transaction to get conducted
                                                      cy.wait(1000);
                                                      getTransactionReceipt(
                                                        NODE_ADDRESS,
                                                        hash.body.result,
                                                      ).then(receipt => {
                                                        // Check if the conducted transaction was successful
                                                        expect(receipt.body.result.status).to.equal(
                                                          ETransactionStatus.SUCCESS,
                                                        );
                                                        // Modal Should Detect The transaction and Transition to success flow
                                                        cy.get(
                                                          tid(
                                                            "modals.icbm-balance-modal.balance-footer.successful-transaction",
                                                          ),
                                                        );
                                                      });
                                                    });
                                                  });
                                              });
                                            });
                                          });
                                        });
                                      },
                                    );
                                  },
                                );
                              },
                            );
                          });
                      });
                    },
                  );
                },
              );
            });
          });
        });
      });
    });
  });
});
