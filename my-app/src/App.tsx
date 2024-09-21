import {QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";
import {HelmetProvider} from "react-helmet-async";
import {RouterProvider} from "react-router-dom";

import {router} from "router/main.router";

import {queryClient} from "config/query-client";

import {useRegisterData} from "store/use-register-data";

import {getClientIpInfo} from "api/auth";

import {Toaster} from "components/ui/toaster";

import "./App.css";

function App() {
  const {setClientIp} = useRegisterData();

  useEffect(() => {
    const setIp = async () => {
      const ip = await getClientIpInfo();
      setClientIp(ip);
    };
    setIp();
  }, [setClientIp]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
      <Toaster/>
    </HelmetProvider>
  );
}

export default App;
