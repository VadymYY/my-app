const grecaptcha = window.grecaptcha;

export const getRecaptchaToken = async () => {
  const recaptchaToken = import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY;

  return new Promise((resolve, reject) => {
    if (grecaptcha) {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(recaptchaToken, {action: "submit"});
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    } else {
      reject("grecaptcha is not defined");
    }
  });
};
