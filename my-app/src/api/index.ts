import {useMutation, useQuery} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

import {axiosInstance} from "config/api";

import {
  AvailablePaymentMethods,
  BrandConfig,
  CountryItemResponse,
  CryptoAddressReq,
  CryptoAddressType,
  PaymentPageResponse,
  SearchClientResponse,
  SubscriptionObject,
  SubscriptionPackage,
} from "types/common.types";

import {generatePath} from "utils/generate-path";
import {subscriptionExpiry} from "utils/subscription-expiry";
import {useError} from "utils/use-error";
import {useToken} from "utils/use-token";

import {useToast} from "components/ui/use-toast";

const getCountriesAndStates = async (): Promise<CountryItemResponse[]> => {
  const {
    data: {data},
  } = await axiosInstance.get<{ data: CountryItemResponse[] }>(generatePath("/getCountries"));
  return data;
};

export const useGetCountriesAndStates = () => {
  const query = useQuery({
    queryKey: ["countriesAndStates"],
    queryFn: getCountriesAndStates,
    retry: false,
  });
  return query;
};

const getSubscriptions = async (token: string): Promise<SubscriptionObject[]> => {
  const {data} = await axiosInstance.post<{ data: SubscriptionObject[] }>(
    generatePath("/searchSubscriptions"),
    {token},
  );
  return data.data;
};

export const useSubscriptionExpiry = (onInvalidToken: () => Promise<never>) => {
  const token = useToken();

  const query = useQuery({
    queryKey: ["subscriptionExpiry"],
    queryFn: () => {
      if (token) {
        return getSubscriptions(token);
      } else {
        return onInvalidToken();
      }
    },
    retry: false,
  });
  return {...query, subscription: subscriptionExpiry(query.data!) ?? ""};
};

export const useGetSubscriptions = (onInvalidToken: () => Promise<never>) => {
  const token = useToken();

  const query = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => {
      if (token) {
        return getSubscriptions(token);
      } else {
        return onInvalidToken();
      }
    },
    retry: false,
  });
  return query;
};

const getSearchClient = async (token: string): Promise<SearchClientResponse> => {
  const {data} = await axiosInstance.post<{ data: SearchClientResponse }>(
    generatePath("/searchClient"),
    {token},
  );
  return data.data;
};

export const useGetSearchClient = (onInvalidToken: () => Promise<never>) => {
  const token = useToken();

  return useQuery({
    queryKey: ["searchClient"],
    queryFn: () => {
      if (token) {
        return getSearchClient(token);
      } else {
        return onInvalidToken();
      }
    },
    retry: false,
  });
};

const getBrandConfig = async (): Promise<BrandConfig> => {
  const {data} = await axiosInstance.get<{ success: boolean; data: BrandConfig }>(
    generatePath("/getBrandConfig"),
  );
  return data.data;
};

export const useGetBrandConfig = () => {
  const query = useQuery({
    queryKey: ["brandConfig"],
    queryFn: getBrandConfig,
    retry: false,
  });
  return query;
};

const getPaymentPage = async (
  pack: SubscriptionPackage,
  token: string,
): Promise<PaymentPageResponse> => {
  const packageId = pack.value;
  const promoCode = pack.promo?.promoCode;
  const {data} = await axiosInstance.post<{ success: boolean; data: PaymentPageResponse }>(
    generatePath("/getPaymentPage"),
    {packageId, token, promoCode},
  );
  return data.data;
};

export const useGetPaymentPage = (onInvalidToken: () => Promise<never>) => {
  const showError = useError();
  const {toast} = useToast();
  const {t} = useTranslation();
  const token = useToken();

  const mutation = useMutation({
    mutationFn: (pack: SubscriptionPackage) => {
      if (token) {
        return getPaymentPage(pack, token);
      } else {
        return onInvalidToken();
      }
    },
    mutationKey: ["getPaymentPage"],
    onSuccess: (transaction) => {
      if (transaction.amount === 0) {
        toast({
          variant: "default",
          description: t("subscriptions.willGetEmail"),
          title: t("subscriptions.beignProccecced"),
        });
        return;
      }
      window.location.href = transaction.paymentUrl;
    },
    onError: (error) => showError(error),
  });
  return mutation;
};

const getCryptoAddress = async ({transactionId, coin}: CryptoAddressReq) => {
  const {data} = await axiosInstance.post<{ success: boolean; data: CryptoAddressType }>(
    generatePath("/getCryptoAddress"),
    {
      coin,
      transactionId,
    },
  );

  return data.data;
};

export const useGetCryptoAddress = ({transactionId, coin, enabled}: CryptoAddressReq) => {
  const query = useQuery({
    queryKey: ["cryptoAddress", transactionId, coin],
    queryFn: () => {
      return getCryptoAddress({
        coin,
        transactionId,
      });
    },
    retry: false,
    enabled: enabled,
  });
  return query;
};

const getAvailablePaymentMethods = async ({transactionId}: { transactionId: string }) => {
  const {data} = await axiosInstance.post<{ success: boolean; data: AvailablePaymentMethods }>(
    generatePath(`/getAvailablePaymentMethods?transactionId=${transactionId}`),
    {
      transactionId,
    },
  );

  return data.data;
};

export const useGetAvailablePaymentMethods = ({transactionId}: { transactionId: string }) => {
  const query = useQuery({
    queryKey: ["availablePaymentMethods", transactionId],
    queryFn: () => {
      return getAvailablePaymentMethods({
        transactionId,
      });
    },
    retry: false,
    enabled: !!transactionId,
  });
  return query;
};
