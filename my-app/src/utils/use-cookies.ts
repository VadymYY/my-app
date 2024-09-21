const DOMAIN = import.meta.env.VITE_DOMAIN;

export const useCookies = () => {
  const getCookie = (name: string) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const setCookie = (name: string, value: boolean, days: number) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + `;domain=${DOMAIN}; path=/`;
  };

  const removeCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999; domain=${DOMAIN}; path=/`;
  };

  return {getCookie, setCookie, removeCookie};
};