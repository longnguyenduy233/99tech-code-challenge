# List out any issues from top to bottom and provide solutions

## `children` is destructured but its value is never read

1. We destructure `children` from props but we don't use it.
* Solution: Let use our `children` prop: 
```ts
    const { children, ...rest } = props;
    return (
        <div {...rest}>
          {rows}
          {children}
        </div>
    )
```

## Issues inside `getPriority` function

1. A `blockchain` parameter is declare as `any` which is discouraged due to 
loss of type safety. Therefore we should declare a specific type for this parameter.
* Solution: Declare `blockchain` as string instead.

## Some issues inside `sortedBalances` useMemo hook

1. **prices** shouldn't appear in dependencies list of sortedBalances because 
the sortedBalances computation logic don't depend on its value.
2. `lhsPriority` is incorrect variable. It should be `balancePriority` instead.
3. This if condition `balance.amount <= 0` might be incorrect. It should be `balance.amount >= 0`.
4. A return value of callback function of a sort method is lack of `Zero`. In addition, we 
even can simplify it as `return rightPriority - leftPriority;`.  
* Solution:  
```ts
    const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (balancePriority > -99) {
		     if (balance.amount >= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
  }, [balances]);
```
## Issue when compute `rows` array variable

1. We use incorrect array variable (`sortedBalances`) when compute rows array. We should use `formattedBalances` 
instead.
* Solution:
```ts
  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```
