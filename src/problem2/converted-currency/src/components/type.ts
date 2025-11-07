import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { CurrencyModel } from "../type";
import type { FormData } from "../App";

export type CurrencyProps = {
  label: string;
  amountFieldName: keyof FormData;
  currencyFieldName: keyof FormData;
  currencyData: CurrencyModel[];
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
};
