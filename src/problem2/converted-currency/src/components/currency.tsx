import Select from "react-select";
import { Controller } from "react-hook-form";
import React from "react";
import "./currency.scss";
import type { CurrencyProps } from "./type";

function Currency(props: CurrencyProps) {
  const {
    label,
    amountFieldName,
    currencyFieldName,
    currencyData,
    register,
    control,
    errors,
  } = props;
  return (
    <>
      <div className="d-flex flex-col">
        <label className="label-control" htmlFor={amountFieldName}>
          {label}
        </label>
        <div className="d-flex input-amount-container">
          <input
            id={amountFieldName}
            className="col-8 input-amount"
            type="number"
            step="any"
            min="0"
            inputMode="decimal"
            {...register(amountFieldName)}
          />
          <Controller
            control={control}
            name={currencyFieldName}
            render={({ field: { onChange, value, ...restProps } }) => (
              <Select
                className="col-4"
                placeholder="Select Option"
                value={currencyData.find((x: any) => x.value === value)}
                options={currencyData}
                onChange={(option) => onChange(option ? option.value : option)}
                formatOptionLabel={(item) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={item?.image} alt="currency-image" />
                    <span style={{ marginLeft: 5, fontWeight: "bold" }}>
                      {item?.label}
                    </span>
                  </div>
                )}
                {...restProps}
              />
            )}
          />
        </div>
        {errors[amountFieldName] && (
          <p className="error">{errors[amountFieldName].message}</p>
        )}
      </div>
    </>
  );
}

export default React.memo(Currency);
