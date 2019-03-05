import * as cn from "classnames";
import * as React from "react";
import { Col, FormGroup } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import { ECurrency, Money } from "../../../shared/Money";

import * as styles from "./InvestmentTypeSelector.module.scss";

interface IEthWallet {
  type: EInvestmentType.ICBMEth | EInvestmentType.InvestmentWallet;
  balanceEth: string;
  balanceEur: string;
  name: string;
  icon: string;
}

interface InEuroWallet {
  type: EInvestmentType.ICBMnEuro;
  balanceNEuro: string;
  balanceEur: string;
  name: string;
  icon: string;
}
export type WalletSelectionData = IEthWallet | InEuroWallet;

interface IProps {
  wallets: WalletSelectionData[];
  currentType?: EInvestmentType;
  onSelect: (type: EInvestmentType) => void;
}

const WalletBalance: React.FunctionComponent<WalletSelectionData> = wallet => (
  <div className={styles.balance}>
    <div className={styles.balanceValues}>
      <WalletBalanceValues {...wallet} />
    </div>
  </div>
);

const WalletBalanceValues: React.FunctionComponent<WalletSelectionData> = wallet => {
  switch (wallet.type) {
    case EInvestmentType.ICBMEth:
    case EInvestmentType.InvestmentWallet:
      return (
        <>
          <Money currency={ECurrency.ETH} value={wallet.balanceEth} />
          <div className={styles.balanceEur}>
            = <Money currency={ECurrency.EUR} value={wallet.balanceEur} />
          </div>
        </>
      );

    case EInvestmentType.ICBMnEuro:
      return (
        <>
          <Money currency={ECurrency.EUR_TOKEN} value={wallet.balanceNEuro} />
          <div className={styles.balanceEur}>
            = <Money currency={ECurrency.EUR} value={wallet.balanceEur} />
          </div>
        </>
      );
  }
};

export class InvestmentTypeSelector extends React.Component<IProps> {
  render(): React.ReactNode {
    const { wallets, currentType, onSelect } = this.props;
    return (
      <div className={styles.container}>
        {wallets.map(wallet => {
          const checked = currentType === wallet.type;
          return (
            <Col md="6" key={wallet.type}>
              <FormGroup>
                <label className={cn(styles.wrapper, checked && styles.checked)}>
                  <input
                    className={styles.input}
                    checked={checked}
                    onChange={e => onSelect(e.target.value as EInvestmentType)}
                    type="radio"
                    name="investmentType"
                    value={wallet.type}
                    data-test-id={`investment-type.selector.${wallet.type}`}
                  />
                  <div className={styles.box}>
                    <div className={styles.icon}>
                      <img src={wallet.icon} alt="" />
                    </div>
                    <div className={styles.label}>{wallet.name}</div>
                    <WalletBalance {...wallet} />
                  </div>
                </label>
              </FormGroup>
            </Col>
          );
        })}
      </div>
    );
  }
}
