export type TRedeemAdditionalDetails = {
  amount: string;
  bankAccount: {
    bankName: string,
    accountNumberLast4: string;
  },
  bankFee: string;
};
