import {create} from "zustand";

import i18n from "config/i18n";

import {ClientDataDto, RegisterFormData} from "types/common.types";

interface RegisterDataState {
  registerData: ClientDataDto;
  setRegisterData: (data: RegisterFormData) => void;
  setLeadId: (id: string) => void;
  setClientIp: (value: string) => void;
  setTrial: () => void;
  switchSendingMethodToSms: () => void;
  setPhoneVerificationCode: (value: string) => void;
  setCodeId: (value: string) => void;
  setSubSource: (value: string | null) => void;
}

export const useRegisterData = create<RegisterDataState>((set) => ({
  registerData: {
    firstName: "",
    lastName: "",
    username: "",
    birthday: "",
    email: "",
    country: "",
    countryState: "",
    phone: "",
    ip: "",
    language: i18n.language.split("-")[0],
    affiliateId: null,
    codeId: null,
    funnelId: null,
    isLead: null,
    isTrial: false,
    leadId: null,
    mSite: null,
    phoneVerificationCode: null,
    referral: null,
    reff: null,
    subSource: null,
    sendingMethod: "whatsapp",
  },
  setRegisterData: (data) =>
    set((state) => ({
      ...state,
      registerData: {...state.registerData, ...data},
    })),
  setLeadId: (id) =>
    set((state) => ({
      ...state,
      registerData: {...state.registerData, leadId: id, isLead: id},
    })),

  setClientIp: (value) =>
    set((state) => ({...state, registerData: {...state.registerData, ip: value}})),
  setTrial: () =>
    set((state) => ({...state, registerData: {...state.registerData, isTrial: true}})),
  switchSendingMethodToSms: () =>
    set((state) => ({
      ...state,
      registerData: {...state.registerData, sendingMethod: "sms"},
    })),
  setPhoneVerificationCode: (value: string) =>
    set((state) => ({
      ...state,
      registerData: {...state.registerData, phoneVerificationCode: value},
    })),
  setCodeId: (value: string) =>
    set((state) => ({
      ...state,
      registerData: {...state.registerData, codeId: value},
    })),
  setSubSource: (value: string | null) =>
    set((state) => ({
      ...state,
      registerData: {...state.registerData, subSource: value},
    })),
}));
