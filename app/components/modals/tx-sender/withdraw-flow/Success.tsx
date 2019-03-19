import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TWithdrawAdditionalData } from "../../../../modules/tx/transactions/withdraw/types";
import { ETxSenderType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { ConfettiEthereum } from "../../../shared/ethererum";
import { Message } from "../../Message";
import { TxHashAndBlock } from "../shared/TxHashAndBlock";
import { WithdrawTransactionDetails } from "./WithdrawTransactionDetails";

interface IExternalProps {
  txHash: string;
  txTimestamp: number;
}

interface IStateProps {
  additionalData: TWithdrawAdditionalData;
}

type TProps = IExternalProps & IStateProps;

export const WithdrawSuccessLayout: React.FunctionComponent<TProps> = ({
  txHash,
  txTimestamp,
  additionalData,
}) => (
  <Message
    data-test-id="modals.tx-sender.withdraw-flow.success"
    image={<ConfettiEthereum className="mb-3" />}
    title={<FormattedMessage id="withdraw-flow.success" />}
    titleClassName="text-success"
  >
    <WithdrawTransactionDetails
      additionalData={additionalData}
      className="mb-4"
      txTimestamp={txTimestamp}
    />

    <TxHashAndBlock data-test-id="modals.tx-sender.withdraw-flow" txHash={txHash} />
  </Message>
);

export const WithdrawSuccess = appConnect<IStateProps>({
  stateToProps: state => ({
    additionalData: selectTxAdditionalData<ETxSenderType.WITHDRAW>(state)!,
  }),
})(WithdrawSuccessLayout);
