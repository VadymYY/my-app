import {IframeMessageType} from "enums/common.enums";
import {PrivateRoutes} from "enums/router.enums";
import {FC, useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {twMerge} from "tailwind-merge";

import {useLogout} from "api/auth";

import {isLoadedInIframe} from "utils/is-loaded-in-iframe";
import {useApiError} from "utils/use-api-error";

import {AppsIcon} from "assets/icons/apps.icon";
import {BurgerMenuIcon} from "assets/icons/burger-menu.icon";
import {CardIcon} from "assets/icons/card.icon";
import {ChangePasswordIcon} from "assets/icons/change-password.icon";
import {CloseIcon} from "assets/icons/close.icon";
import {FaqIcon} from "assets/icons/faq.icon";
import {LogoIcon} from "assets/icons/logo.icon";
import {LogoutIcon} from "assets/icons/logout.icon";
import {PlayIcon} from "assets/icons/play.icon";
import {ProfileIcon} from "assets/icons/profile.icon";
import {TransactionIcon} from "assets/icons/transactions.icon";

import {Loader} from "../loader.component";
import {Text} from "../typography.component";
import {Sheet, SheetContent, SheetHeader} from "../ui/sheet";

interface MobileMenuDataProps {
  name: string;
  path: PrivateRoutes;
  icon: JSX.Element;
}

const mobileMenuData: MobileMenuDataProps[] = [
  {
    name: "menu.profile",
    path: PrivateRoutes.PROFILE_PATH,
    icon: <ProfileIcon width={30}/>,
  },
  {
    name: "menu.transactions",
    path: PrivateRoutes.TRANSACTIONS_PATH,
    icon: <TransactionIcon width={30}/>,
  },
  {
    name: "menu.subscriptions",
    path: PrivateRoutes.SUBSCRIPTIONS_PATH,
    icon: <CardIcon width={30}/>,
  },
];

const additionalMenuData: MobileMenuDataProps[] = [
  {
    name: "menu.startwatching",
    path: PrivateRoutes.START_WATCHING,
    icon: <PlayIcon width={32}/>,
  },
  {
    name: "menu.apps",
    path: PrivateRoutes.APPS_PATH,
    icon: <AppsIcon width={32}/>,
  },
  {
    name: "menu.changepassword",
    path: PrivateRoutes.CHANGE_PASSWORD_PATH,
    icon: <ChangePasswordIcon width={32}/>,
  },
  {
    name: "menu.faq",
    path: PrivateRoutes.FAQ_PATH,
    icon: <FaqIcon width={32}/>,
  },
];

export const MobileMenu: FC = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const {onInvalidToken} = useApiError();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {mutateAsync: logout, isPending: logoutPending} = useLogout(onInvalidToken);

  const isIframe = isLoadedInIframe();

  const menuItemStyles = "flex-1 text-white text-opacity-60 hidden md:flex flex-col justify-center items-center";

  const openMenu = useCallback(() => setIsMenuOpen(true), []);

  const closeMenu = () => setIsMenuOpen(false);

  const renderMobileMenuItem = ({name, path, icon}: MobileMenuDataProps) => {
    const isActiveLink = location.pathname === path;
    return (
      <li
        key={name}
        className={twMerge(menuItemStyles, isActiveLink && "text-white text-opacity-100")}
      >
        <Link
          to={path}
          className="px-1.5 py-2 w-full h-full flex flex-col justify-center items-center"
        >
          {icon}
          <Text
            className={twMerge(
              "text-opacity-60 mt-1.5 xs:hidden",
              isActiveLink && "text-white text-opacity-100",
            )}
          >
            {t(name)}
          </Text>
        </Link>
      </li>
    );
  };

  const renderAdditionalMenuItem = ({name, path, icon}: MobileMenuDataProps) => {
    const isActiveLink = location.pathname === path;
    return (
      <li
        key={name}
        className={twMerge(
          "border-b border-white border-opacity-10 last:border-none text-white text-opacity-80",
          isActiveLink && "text-white text-opacity-100",
        )}
      >
        <Link to={path} className="flex items-center px-4 py-8" onClick={closeMenu}>
          {icon}
          <Text
            className={twMerge(
              "text-opacity-80 ml-4 text-xl",
              isActiveLink && "text-white text-opacity-100",
            )}
          >
            {t(name)}
          </Text>
        </Link>
      </li>
    );
  };

  const handleLogout = useCallback(async () => await logout(), [logout]);

  useEffect(() => {
    if (isMenuOpen) {
      window.parent.postMessage({type: IframeMessageType.SCROLL, value: "toTop"}, "*");
    }
  }, [isMenuOpen]);

  return (
    <>
      {mobileMenuData.map(renderMobileMenuItem)}
      <li className={menuItemStyles} onClick={openMenu}>
        <BurgerMenuIcon width={30} className="mt-1 xs:mt-0"/>
        <Text className="text-opacity-60 mt-2.5 xs:hidden">{t("menu.menu")}</Text>
      </li>

      <Sheet open={isMenuOpen}>
        <SheetContent
          className={twMerge(
            "hidden md:block w-full sm:max-w-full h-[100dvh] bg-black outline-none z-[9999999]",
            isMenuOpen ? "animate-slideUp" : "animate-slideDown",
          )}
        >
          <SheetHeader>
            <div className="z-10 flex items-center justify-between px-4">
              <LogoIcon
                width={60}
                className={twMerge("text-light", isIframe && "hidden")}
              />
              <CloseIcon
                className="ml-auto text-light"
                width={14}
                onClick={closeMenu}
              />
            </div>
          </SheetHeader>

          <nav>
            <ul className="py-4">
              {additionalMenuData.map(renderAdditionalMenuItem)}
              <li className="flex items-center px-4 py-8" onClick={handleLogout}>
                <LogoutIcon className="text-white text-opacity-80" width={32}/>
                <Text className="ml-4 text-xl text-opacity-80">
                  {t("menu.logout")}
                </Text>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {logoutPending && <Loader/>}
    </>
  );
};
