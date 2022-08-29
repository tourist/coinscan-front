import type { GetWalletsPaginatedWithTransactionsQuery } from '../../generated/graphql';

export type Wallet = GetWalletsPaginatedWithTransactionsQuery['wallets'][0];

export function getNetFlowPercentageFromWallet(
  wallet: Wallet | null | undefined,
  timestamp: number
): number {
  let percent = 0;
  if (!wallet) return percent;

  const positiveFlow = wallet.transactionsTo.reduce((acc, transaction) => {
    if (Number(transaction.timestamp) >= timestamp) {
      return acc + BigInt(transaction.value);
    }
    return acc;
  }, BigInt(0));

  const negativeFlow = wallet.transactionsFrom.reduce((acc, transaction) => {
    if (Number(transaction.timestamp) >= timestamp) {
      return acc + BigInt(transaction.value);
    }
    return acc;
  }, BigInt(0));

  const preTransactionWalletBalance =
    BigInt(wallet.value) - positiveFlow + negativeFlow;

  // clamp bar width to max 100% (show real value > 100% only as text)
  if (preTransactionWalletBalance === BigInt(0)) {
    if (wallet.value > BigInt(0)) {
      percent = 100;
    } else {
      percent = 0;
    }
  } else {
    const first = Number(
      (BigInt(wallet.value) * BigInt(100)) / preTransactionWalletBalance
    );
    percent = first - 100;
  }

  return Number(percent);
}
