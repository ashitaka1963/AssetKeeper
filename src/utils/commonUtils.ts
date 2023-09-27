import dayjs from 'dayjs';

// 整数値の場合、先頭に「+」を付与する
export function addPlusSign(number: number) {
  if (typeof number === 'number' && Number.isInteger(number)) {
    return number >= 0 ? `+${number.toLocaleString()}` : `${number.toLocaleString()}`;
  } else {
    throw new Error('Invalid input. Please provide an integer.');
  }
}

// 増加率の計算
export function calculateIncreaseRatio(currentValue: number, previousValue: number) {
  if (typeof previousValue === 'number' && typeof currentValue === 'number') {
    const increase = currentValue - previousValue;
    // const ratio = (increase / previousValue) * 100;
    const ratio = previousValue !== 0 ? (increase / previousValue) * 100 : 0;
    const formattedRatio = ratio >= 0 ? `+${ratio.toFixed(1)}` : `${ratio.toFixed(1)}`;
    return formattedRatio;
  } else {
    throw new Error(
      'Invalid input. Please provide valid numbers for the previous and current values.'
    );
  }
}

// 0より大きい場合、trueを返す
export function isPositive(value: number): boolean {
  return value > 0;
}

// 残高履歴一覧から日付が一致する残額を取得する
export function findSameDate(balanceHistory: any, targetDate: any, unit: dayjs.OpUnitType): number {
  const foundData = balanceHistory.find((item: any) => {
    const balanceDate = dayjs(item.balance_date);
    return balanceDate.isSame(targetDate, unit);
  });

  return foundData ? foundData.amount : 0;
}
