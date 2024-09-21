import {zodResolver} from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {PublicRoutes} from "enums/router.enums";
import {FC, useCallback, useEffect, useMemo} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Link, useNavigate, useSearchParams} from "react-router-dom";

import {useRegisterData} from "store/use-register-data";

import {
  useCheckRegistrationPermission,
  useGetClientCountryInformation,
  useGetLeadById,
  useRegisterUser,
} from "api/auth";
import {useGetCountriesAndStates} from "api/index";

import {BIRTHDAY_FORMAT_VALUE} from "constants/common.constants";
import {registerDefaultValues} from "constants/form.constants";

import {RegisterFormField, RegisterValidationSchema} from "types/form.types";

import {registerValidationSchema} from "schemas/common.schemas";

import {getRecaptchaToken} from "utils/get-recapthca-token";
import {isPhoneValid} from "utils/validate-phone";

import {FormCheckbox} from "components/form/form-checkbox.component";
import {FormDatePicker} from "components/form/form-datepicker.component";
import {FormInput} from "components/form/form-input.component";
import {FormPhoneInput} from "components/form/form-phone-input.component";
import {FormSelect} from "components/form/form-select.component";
import {Loader} from "components/loader.component";
import {MainTitle, Text, Title} from "components/typography.component";
import {Button} from "components/ui/button";
import {Form} from "components/ui/form";

const Register: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {t} = useTranslation();

  const {
    mutateAsync: mutateAsyncCheckRegistrationPermission,
    isPending: checkRegistrationPending,
  } = useCheckRegistrationPermission();
  const {mutateAsync: mutateAsyncGetLead, isPending: getLeadByIdPending} = useGetLeadById();
  const {mutateAsync: mutateAsyncRegisterUser, isPending: registerUserPending} =
    useRegisterUser();
  const {data: countryCode, isPending: clientCountryPending} = useGetClientCountryInformation();
  const {data: countries, isPending: getCountriesAndStatesPending} = useGetCountriesAndStates();
  const {setRegisterData, registerData} = useRegisterData();

  const pendingItems =
    checkRegistrationPending ||
    clientCountryPending ||
    registerUserPending ||
    getLeadByIdPending ||
    getCountriesAndStatesPending;

  const leadId = searchParams.get("leadId");
  const trial = searchParams.get("trial");

  const form = useForm<RegisterValidationSchema>({
    defaultValues: registerDefaultValues,
    resolver: zodResolver(registerValidationSchema(t, Boolean(trial))),
    mode: "onTouched",
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {isValid, dirtyFields},
    reset,
    setError,
  } = form;

  const onSubmit: SubmitHandler<RegisterValidationSchema> = async ({
                                                                     firstName,
                                                                     lastName,
                                                                     username,
                                                                     email,
                                                                     phone,
                                                                     country,
                                                                     countryState,
                                                                     birthday,
                                                                     referral,
                                                                   }) => {
    const isValidPhone = isPhoneValid(phone!);

    if (phone && phone.length > 5 && !isValidPhone) {
      setError(RegisterFormField.PHONE, {message: t("forms.errorMessages.validPhone")});
      return;
    }

    const clientData = {
      firstName,
      lastName,
      username,
      email,
      country,
      phone: phone && isValidPhone ? phone : "",
      countryState: countryState || null,
      isTrial: trial ? true : false,
      referral: referral || null,
      birthday: dirtyFields.birthday
        ? dayjs(birthday).format(BIRTHDAY_FORMAT_VALUE).toString()
        : "",
    };

    setRegisterData(clientData);

    const isBannedRegistration = await mutateAsyncCheckRegistrationPermission();

    if (!isBannedRegistration) {
      if (isValidPhone) {
        navigate(PublicRoutes.PHONE_VALIDATION_PATH);
      } else {
        const recaptchaToken = (await getRecaptchaToken()) as string;

        await mutateAsyncRegisterUser(recaptchaToken);
      }
    }
  };

  const renderCheckboxLabel = () => (
    <Text className="font-normal">
      {t("forms.agreement")}&nbsp;
      <Link to={PublicRoutes.PRIVACY_POLICY_PATH} className="text-primary text-sm underline">
        {t("forms.privacyPolicy")}
      </Link>
    </Text>
  );

  const states = useMemo(
    () => countries?.find((item) => item.code === watch().country)?.states ?? [],
    [countries?.length, watch().country],
  );

  const renderLabel = useCallback(
    (text: string) => (
      <div>
        {t(text)}&nbsp;
        {!trial && (
          <span className="text-white text-opacity-30">({t("common.optional")})</span>
        )}
      </div>
    ),
    [t, trial],
  );

  useEffect(() => {
    if (countryCode) {
      setValue(RegisterFormField.COUNTRY, countryCode);
    }
  }, [countryCode, setValue]);

  useEffect(() => {
    const getLead = async () => {
      const result = await mutateAsyncGetLead(leadId!);
      reset({
        firstName: result.firstName,
        lastName: result.lastName,
        country: result.country ?? countryCode,
        countryState: result.countryState ?? "",
        referral: result.promoId ?? "",
      });
    };

    if (leadId) {
      getLead();
    }
  }, [leadId, mutateAsyncGetLead, reset, countryCode]);

  useEffect(() => {
    const {firstName, lastName, username, birthday, email, countryState, referral} =
      registerData;

    reset({
      firstName: firstName ?? registerDefaultValues.firstName,
      lastName: lastName ?? registerDefaultValues.lastName,
      username: username ?? registerDefaultValues.username,
      email: email ?? registerDefaultValues.email,
      birthday: birthday ?? registerDefaultValues.birthday,
      countryState: countryState ?? registerDefaultValues.countryState,
      agreement: false,
      referral: referral ?? registerDefaultValues.referral,
    });
  }, [registerData, reset]);

  return (
    <>
      <section
        aria-label={t("arialLabels.registrationPage")}
        className="w-full flex-1 flex overflow-y-auto"
      >
        <div className="overflow-hidden bg-register bg-cover bg-center bg-no-repeat lg:hidden flex-1"/>
        <div
          aria-label={t("arialLabels.registrationForm")}
          className="px-16 md:px-4 py-24 md:pt-6 h-full w-full flex-1 overflow-y-auto"
        >
          <MainTitle className="mb-6">{t("forms.registration")}</MainTitle>
          {leadId && (
            <div className="w-full mb-6 px-6 py-2 rounded-lg bg-white bg-opacity-5 text-center">
              <Text className="text-lg">{t("forms.weHopeYouEnjoyed")}</Text>
              <Text className="text-white text-opacity-60">
                {t("forms.inOrderToKeepEnjoying")}
              </Text>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Title className="mb-4">{t("forms.personalInformation")}</Title>
              <div
                aria-label={t("arialLabels.personalInformation")}
                className="pb-6 mb-6 border-b border-white border-opacity-10"
              >
                <div className="flex sm:flex-col gap-x-4 sm:gap-y-4 w-full mb-6">
                  <FormInput
                    control={control}
                    name={RegisterFormField.FIRST_NAME}
                    label={t("forms.firstName")}
                  />
                  <FormInput
                    control={control}
                    name={RegisterFormField.LAST_NAME}
                    label={t("forms.lastName")}
                  />
                </div>

                <div className="flex flex-col gap-6">
                  <FormInput
                    control={control}
                    name={RegisterFormField.USERNAME}
                    label={t("forms.username")}
                  />
                  <FormDatePicker
                    control={control}
                    name={RegisterFormField.BIRTHDAY}
                    label={renderLabel("forms.birthday")}
                  />
                  <FormInput
                    control={control}
                    name={RegisterFormField.REFERRAL}
                    label={renderLabel("forms.referral")}
                  />
                </div>
              </div>

              <Title className="mb-4">{t("forms.contactInformation")}</Title>

              <div aria-label={t("arialLabels.contactInformation")} className="mb-4">
                <div className="mb-6">
                  <FormInput
                    control={control}
                    name={RegisterFormField.EMAIL}
                    label={t("forms.email")}
                  />
                </div>

                <div className="flex sm:flex-col gap-x-4 sm:gap-y-4 w-full mb-6">
                  <FormSelect
                    control={control}
                    name={RegisterFormField.COUNTRY}
                    label={t("forms.selectCountry")}
                    options={countries ?? []}
                    placeholder={""}
                    defaultValue={countryCode}
                  />
                  <FormSelect
                    control={control}
                    name={RegisterFormField.STATE}
                    label={t("forms.state")}
                    options={states}
                    placeholder={""}
                  />
                </div>

                <FormPhoneInput
                  control={control}
                  name={RegisterFormField.PHONE}
                  label={renderLabel("forms.phoneNumber")}
                  defaultCountry={
                    watch().country?.toLowerCase() || countryCode?.toLowerCase()
                  }
                />
              </div>

              <FormCheckbox
                control={control}
                name={RegisterFormField.AGREEMENT}
                label={renderCheckboxLabel()}
                containerClassName="mb-7"
              />

              <div className="flex justify-between items-center">
                <Link to={PublicRoutes.LOGIN_PATH}>
                  <Button variant="outline" className="w-36">
                    {t("common.cancel")}
                  </Button>
                </Link>

                <Button type="submit" className="w-36" disabled={!isValid}>
                  {t("forms.register")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>

      {pendingItems && <Loader/>}
    </>
  );
};

export default Register;
