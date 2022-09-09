import type { GetWalletsPaginatedWithTransactionsQuery } from '../../generated/graphql';

export type Wallet = GetWalletsPaginatedWithTransactionsQuery['wallets'][0];

export function getNetFlowPercentageFromWallet(
  wallet: Wallet | null | undefined,
  timestamp: number
): number {
  let percent = 0;
  if (!wallet) return percent;

  const positiveFlow = wallet.dailyStates.reduce((acc, dailyState) => {
    if (Number(dailyState.start) >= timestamp) {
      return acc + BigInt(dailyState.inflow);
    }
    return acc;
  }, BigInt(0));

  const negativeFlow = wallet.dailyStates.reduce((acc, dailyState) => {
    if (Number(dailyState.start) >= timestamp) {
      return acc + BigInt(dailyState.outflow);
    }
    return acc;
  }, BigInt(0));

  const previousWalletBalance =
    BigInt(wallet.value) - positiveFlow + negativeFlow;

  // clamp bar width to max 100% (show real value > 100% only as text)
  if (previousWalletBalance === BigInt(0)) {
    if (BigInt(wallet.value) > BigInt(0)) {
      percent = 100;
    } else {
      percent = 0;
    }
  } else {
    percent =
      Number(
        ((positiveFlow - negativeFlow) * BigInt(10000)) / previousWalletBalance
      ) / 100;
  }

  return percent;
}
