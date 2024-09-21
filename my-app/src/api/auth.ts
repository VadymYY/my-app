import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {AlreadyExist} from "enums/common.enums";
import {PrivateRoutes, PublicRoutes} from "enums/router.enums";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {axiosInstance} from "config/api";
import {queryClient} from "config/query-client";

import {useRegisterData} from "store/use-register-data";

import {TOKEN} from "constants/common.constants";

import {
  AllowLeadRegistrationDataResponse,
  ClientDataDto,
  CountryInformationResponse,
  ForgotPassword,
  GetLeadResponse,
  IsRegistrationAllowedDto,
  LoginCreds,
  LoginResponse,
  RegistrationResponse,
  SendPhoneVerificationCodeAndCreateLeadResponse,
} from "types/common.types";

import {generatePath} from "utils/generate-path";
import {updateChatState} from "utils/update-chat";
import {useCookies} from "utils/use-cookies";
import {useError} from "utils/use-error";
import {useToken} from "utils/use-token";

import {useToast} from "components/ui/use-toast";

const getClientCountryInformation = async (): Promise<string> => {
  const {data} = await axios.get<CountryInformationResponse>(
    import.meta.env.VITE_COUNTRY_INFO_LINK ?? "",
  );
  return data.countryCode;
};

export const useGetClientCountryInformation = () => {
  const query = useQuery({
    queryKey: ["countryInformation"],
    queryFn: getClientCountryInformation,
    retry: false,
  });
  return query;
};

export const getClientIpInfo = async (): Promise<string> => {
  try {
    const link = import.meta.env.VITE_GET_CLIENT_IP_INFO_LINK;
    const {data} = await axios.get<{ ip: string }>(link);
    return data.ip;
  } catch (error) {
    throw new Error("Failed to get client ip info");
  }
};

const checkRegistrationPermission = async (
  clientData: IsRegistrationAllowedDto,
): Promise<AllowLeadRegistrationDataResponse | null> => {
  const {data} = await axiosInstance.post<{
    success: boolean;
    data: AllowLeadRegistrationDataResponse | null;
  }>(generatePath("/allowLeadRegistration"), clientData);
  return data.data;
};

export const useCheckRegistrationPermission = () => {
  const {t} = useTranslation();
  const {toast} = useToast();
  const showError = useError();
  const {registerData} = useRegisterData();

  const clientData = {
    email: registerData.email,
    phoneNumber: registerData.phone ?? "",
    username: registerData.username,
    isTrial: registerData.isTrial,
  };

  const mutation = useMutation({
    mutationFn: () => checkRegistrationPermission(clientData),
    mutationKey: ["checkRegistrationPermission"],
    onSuccess: (data) => {
      if (data) {
        const key = Object.keys(data)[0];
        const existBy = AlreadyExist[key as keyof typeof AlreadyExist];

        toast({
          variant: "destructive",
          description: t("registrationPage.alreadyExist", {existBy}),
        });
      }
    },
    onError: (error) => showError(error.message),
  });
  return mutation;
};

const registerUser = async (
  registerData: ClientDataDto,
  googleCaptcha: string,
): Promise<RegistrationResponse> => {
  const clientData = {...registerData, googleCaptcha};

  const {
    data: {data},
  } = await axiosInstance.post<{
    data: RegistrationResponse;
    success: boolean;
  }>(generatePath("/register"), clientData);
  return data;
};

export const useRegisterUser = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {toast} = useToast();
  const showError = useError();
  const {setCookie} = useCookies();

  const {registerData} = useRegisterData();

  const mutation = useMutation({
    mutationFn: (googleCaptcha: string) => registerUser(registerData, googleCaptcha),
    mutationKey: ["registerUser"],
    onSuccess: (data) => {
      if (Object.keys(data).includes("error101")) {
        toast({
          variant: "destructive",
          description: t("registration.error101"),
        });
        return;
      }

      const {token, shouldRedirect} = data;

      if (token) {
        localStorage.setItem(TOKEN, token);
        setCookie("userLoggedIn", true, 30);

        navigate(
          shouldRedirect
            ? PrivateRoutes.SUBSCRIPTIONS_PATH
            : PrivateRoutes.START_WATCHING,
        );
      }
    },
    onError: (error) => showError(error),
  });
  return mutation;
};

const sendPhoneVerificationCodeAndCreateLead = async (
  registerData: ClientDataDto,
  googleCaptcha: string,
): Promise<SendPhoneVerificationCodeAndCreateLeadResponse> => {
  const leadData = {
    affiliateId: registerData.affiliateId,
    country: registerData.country,
    countryState: registerData.countryState,
    email: registerData.email,
    firstName: registerData.firstName,
    funnelId: registerData.funnelId,
    ip: registerData.ip,
    isLead: registerData.isLead,
    isTrial: registerData.isTrial,
    lastName: registerData.lastName,
    leadId: registerData.leadId,
    mSite: registerData.mSite,
    phone: registerData.phone,
    referral: registerData.referral,
    reff: registerData.reff,
    sendingMethod: registerData.sendingMethod,
    subSource: registerData.subSource,
    username: registerData.username,
  };

  const {
    data: {data},
  } = await axiosInstance.post<{
    success: boolean;
    data: SendPhoneVerificationCodeAndCreateLeadResponse;
  }>(generatePath("/sendPhoneVerificationCodeAndCreateLead"), {
    googleCaptcha,
    leadData,
  });
  return data;
};

export const useSendPhoneVerificationCodeAndCreateLead = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {toast} = useToast();
  const showError = useError();
  const {registerData, setLeadId, switchSendingMethodToSms, setCodeId} = useRegisterData();

  const mutation = useMutation({
    mutationFn: (googleCaptcha: string) =>
      sendPhoneVerificationCodeAndCreateLead(registerData, googleCaptcha),
    mutationKey: ["sendPhoneVerificationCodeAndCreateLead"],
    onSuccess: (data) => {
      if (data.alreadyExist) {
        const key = Object.keys(data)[1];
        const existBy = AlreadyExist[key as keyof typeof AlreadyExist];
        navigate(PublicRoutes.REGISTRATION_PATH);
        toast({
          variant: "destructive",
          description:
            key === "error101"
              ? t("registration.error101")
              : t("registration.alreadyExist", {existBy}),
        });
      }
      if (data.leadId) {
        setLeadId(data.leadId.toString());
      }
      if (data.switchClientToSms) {
        switchSendingMethodToSms();
      }
      if (data.codeId) {
        setCodeId(data.codeId);
      }
    },
    onError: (error) => showError(error),
  });
  return mutation;
};

const getLeadById = async (leadId: string): Promise<GetLeadResponse> => {
  const {
    data: {data},
  } = await axiosInstance.get<{ success: boolean; data: GetLeadResponse }>(
    generatePath(`/getLead?leadId=${leadId}`),
  );
  return data;
};

export const useGetLeadById = () => {
  const {setLeadId, setSubSource} = useRegisterData();
  const showError = useError();

  const mutation = useMutation({
    mutationFn: getLeadById,
    mutationKey: ["getLeadById"],
    onSuccess: (data) => {
      if (data.id) {
        setLeadId(data.id);
      }

      if (data.subSource) {
        setSubSource(data.subSource);
      }
    },
    onError: (error) => showError(error),
  });
  return mutation;
};

const login = async (creds: LoginCreds): Promise<LoginResponse> => {
  const {
    data: {data},
  } = await axiosInstance.post<{ data: LoginResponse }>(generatePath("/login"), creds);
  return data;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {setCookie} = useCookies();
  const showError = useError();

  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    onSuccess: ({token, error}) => {
      if (token) {
        localStorage.setItem(TOKEN, token);
        updateChatState(token);
        setCookie("userLoggedIn", true, 30);
        navigate(PrivateRoutes.START_WATCHING);
      }
      if (error) setLoginError(error);
    },
    onError: (error) => showError(error),
  });
  return {...mutation, loginError};
};

const logout = async (token: string): Promise<string> => {
  const {
    data: {data},
  } = await axiosInstance.post<{ data: string }>(generatePath("/logout"), token);
  return data;
};

export const useLogout = (onInvalidToken: () => Promise<never>) => {
  const navigate = useNavigate();
  const {removeCookie} = useCookies();
  const showError = useError();
  const token = useToken();

  const mutation = useMutation({
    mutationFn: () => {
      if (token) {
        return logout(token);
      } else {
        return onInvalidToken();
      }
    },
    mutationKey: ["logout"],
    onSuccess: () => {
      localStorage.removeItem(TOKEN);
      queryClient.resetQueries();
      removeCookie("userLoggedIn");
      navigate(PublicRoutes.LOGIN_PATH);
    },
    onError: (error) => showError(error),
  });
  return mutation;
};

const forgotPassword = async (body: ForgotPassword): Promise<boolean> => {
  const {
    data: {data},
  } = await axiosInstance.post<{ data: boolean }>(
    generatePath("/generateNewPasswordByMail"),
    body,
  );

  return data;
};

export const useForgotPassword = () => {
  const showError = useError();

  const mutation = useMutation({
    mutationFn: forgotPassword,
    mutationKey: ["forgotPassword"],
    onError: (error) => showError(error),
  });
  return mutation;
};

const changePassword = async ({
                                newPassword,
                                token,
                              }: {
  newPassword: string;
  token: string;
}): Promise<unknown> => {
  const {
    data: {data},
  } = await axiosInstance.post(generatePath("/changePass"), {
    newPassword,
    token,
  });
  return data;
};

export const useChangePassword = (onInvalidToken: () => Promise<never>) => {
  const {t} = useTranslation();
  const {toast} = useToast();
  const token = useToken();

  const mutation = useMutation({
    mutationFn: (newPassword: string) => {
      if (token) {
        return changePassword({token, newPassword});
      } else {
        return onInvalidToken();
      }
    },
    mutationKey: ["changePassword"],
    onSuccess: () =>
      toast({
        description: t("changePassword.success"),
      }),
    onError: () =>
      toast({
        variant: "destructive",
        description: t("changePassword.error"),
      }),
  });
  return mutation;
};
