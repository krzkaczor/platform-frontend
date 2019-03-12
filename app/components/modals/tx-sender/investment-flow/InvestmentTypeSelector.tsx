import * as cn from "classnames";
import * as React from "react";
import { Col, FormGroup } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import { getCurrencyByInvestmentType } from "../../../../modules/investment-flow/utils";
import { CurrencyIcon } from "../../../shared/icons/CurrencyIcon";
import { ECurrency, Money } from "../../../shared/Money";

import * as styles from "./InvestmentTypeSelector.module.scss";

interface IEthWallet {
  type: EInvestmentType.ICBMEth | EInvestmentType.Eth;
  balanceEth: string;
  balanceEur: string;
  name: string;
}

interface InEuroWallet {
  type: EInvestmentType.ICBMnEuro | EInvestmentType.NEur;
  balanceNEuro: string;
  balanceEur: string;
  name: string;
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
    case EInvestmentType.Eth:
      return (
        <>
          <Money currency={ECurrency.ETH} value={wallet.balanceEth} />
          <div className={styles.balanceEur}>
            = <Money currency={ECurrency.EUR} value={wallet.balanceEur} />
          </div>
        </>
      );

    case EInvestmentType.NEur:
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
                    <CurrencyIcon
                      currency={getCurrencyByInvestmentType(wallet.type)}
                      className={styles.icon}
                    />
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
