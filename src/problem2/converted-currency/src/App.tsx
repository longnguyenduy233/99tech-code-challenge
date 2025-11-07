import { useEffect, useState } from "react";
import ampLUNA from "./assets/ampLUNA.svg";
import BLUR from "./assets/BLUR.svg";
import bNEO from "./assets/bNEO.svg";
import BUSD from "./assets/BUSD.svg";
import ETH from "./assets/ETH.svg";
import EVMOS from "./assets/EVMOS.svg";
import GMX from "./assets/GMX.svg";
import IBCX from "./assets/IBCX.svg";
import USD from "./assets/USD.svg";
import LUNA from "./assets/LUNA.svg";
import "./App.scss";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Currency from "./components/currency";
import { BeatLoader } from "react-spinners";
import type { PriceModel, CurrencyModel } from "./type";

const currencyData: CurrencyModel[] = [
  {
    value: "ETH",
    label: "ETH",
    image: ETH,
  },
  {
    value: "USD",
    label: "USD",
    image: USD,
  },
  {
    value: "LUNA",
    label: "LUNA",
    image: LUNA,
  },
  {
    value: "bNEO",
    label: "bNEO",
    image: bNEO,
  },
  {
    value: "ampLUNA",
    label: "ampLUNA",
    image: ampLUNA,
  },
  {
    value: "BLUR",
    label: "BLUR",
    image: BLUR,
  },
  {
    value: "BUSD",
    label: "BUSD",
    image: BUSD,
  },
  {
    value: "EVMOS",
    label: "EVMOS",
    image: EVMOS,
  },
  {
    value: "GMX",
    label: "GMX",
    image: GMX,
  },
  {
    value: "IBCX",
    label: "IBCX",
    image: IBCX,
  },
];

const schema = yup.object({
  amountToSend: yup.string().required("Please enter amount"),
  fromCurrency: yup.string().required(),
  toCurrency: yup.string().required(),
  amountToReceive: yup.string().nullable(),
});

export type FormData = yup.InferType<typeof schema>;

function App() {
  const [loading, setLoading] = useState(false);
  const yupSchema = yupResolver<FormData, unknown, unknown>(schema);
  const {
    register,
    handleSubmit,
    formState,
    control,
    setValue,
    getValues,
    setFocus,
    reset,
  } = useForm<FormData>({
    resolver: yupSchema,
    defaultValues: {
      fromCurrency: currencyData[0].value,
      toCurrency: currencyData[1].value,
    },
  });

  useEffect(() => {
    setFocus("amountToSend");
  }, [setFocus]);

  const { errors } = formState;
  const onSubmit = (formData: FormData) => {
    setLoading(true);
    const { amountToSend, fromCurrency, toCurrency } = getValues();
    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((res) => {
        const { data } = res;
        const prices: PriceModel[] = data;
        const fromPriceObj = prices.find(
          (price) => price.currency === fromCurrency,
        );
        if (!fromPriceObj) return;
        const fromPrice = fromPriceObj.price;
        const toPriceObj = prices.find(
          (price) => price.currency === toCurrency,
        );
        if (!toPriceObj) return;
        const toPrice = toPriceObj.price;
        const amountToSendAsNumber = parseFloat(amountToSend);
        const amountToReceive = (amountToSendAsNumber * fromPrice) / toPrice;
        setValue("amountToReceive", amountToReceive.toString());
        setTimeout(() => setLoading(false), 1000);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onSwapCurrency = () => {
    const { amountToSend, amountToReceive, fromCurrency, toCurrency } =
      getValues();
    setValue("amountToSend", amountToReceive || "", { shouldValidate: true });
    setValue("amountToReceive", amountToSend || "");
    setValue("toCurrency", fromCurrency || "");
    setValue("fromCurrency", toCurrency || "");
  };

  const onReset = () => {
    setFocus("amountToSend");
    reset();
  };

  return (
    <>
      {loading && (
        <div className="spinner d-flex flex-content-center flex-item-center">
          <BeatLoader loading />
        </div>
      )}
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Exchange Rate Calculator</h2>
          <div className="d-flex flex-col">
            <Currency
              label={"Amount to send"}
              amountFieldName={"amountToSend"}
              currencyFieldName={"fromCurrency"}
              currencyData={currencyData}
              register={register}
              control={control}
              errors={errors}
            />
            <div className="swap-button-container">
              <button
                type="button"
                className="swap-button"
                onClick={onSwapCurrency}
              >
                <FaArrowRightArrowLeft />
              </button>
            </div>
            <Currency
              label={"Amount to receive"}
              amountFieldName={"amountToReceive"}
              currencyFieldName={"toCurrency"}
              currencyData={currencyData}
              register={register}
              control={control}
              errors={errors}
            />
          </div>

          <div className="d-flex gx-1 flex-content-center my-1">
            <button type="submit" className="submit-button">
              Calculate
            </button>
            <button type="button" className="reset-button" onClick={onReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;
