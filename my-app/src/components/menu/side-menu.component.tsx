import {PrivateRoutes} from "enums/router.enums";
import {FC, useCallback} from "react";
import {useTranslation} from "react-i18next";
import {Link, useLocation} from "react-router-dom";
import {twMerge} from "tailwind-merge";

import {AppsIcon} from "assets/icons/apps.icon";
import {CardIcon} from "assets/icons/card.icon";
import {ChangePasswordIcon} from "assets/icons/change-password.icon";
import {FaqIcon} from "assets/icons/faq.icon";
import {PlayIcon} from "assets/icons/play.icon";
import {ProfileIcon} from "assets/icons/profile.icon";
import {TransactionIcon} from "assets/icons/transactions.icon";

import {Envelop} from "components/envelop.component";
import {Logout} from "components/logout.component";
import {Button} from "components/ui/button";

interface Props {
  className?: string;
}

const setIcon = (
  className?: string,
  size?: number,
  fill?: string,
): { [key: string]: React.ReactNode } => ({
  [PrivateRoutes.HOME_PATH]: null,
  [PrivateRoutes.START_WATCHING]: <PlayIcon width={size} fill={fill} className={className}/>,
  [PrivateRoutes.PROFILE_PATH]: <ProfileIcon width={size} fill={fill} className={className}/>,
  [PrivateRoutes.APPS_PATH]: <AppsIcon width={size} fill={fill} className={className}/>,
  [PrivateRoutes.TRANSACTIONS_PATH]: (
    <TransactionIcon width={size} fill={fill} className={className}/>
  ),
  [PrivateRoutes.SUBSCRIPTIONS_PATH]: <CardIcon width={size} fill={fill} className={className}/>,
  [PrivateRoutes.CHANGE_PASSWORD_PATH]: (
    <ChangePasswordIcon width={size} fill={fill} className={className}/>
  ),
  [PrivateRoutes.FAQ_PATH]: <FaqIcon width={size} fill={fill} className={className}/>,
});

export const SideMenu: FC<Props> = ({className}) => {
  const pathName = useLocation().pathname.toLowerCase();
  const {t} = useTranslation();

  const renderNavigationLink = useCallback(
    (item: string) => {
      if (item === PrivateRoutes.WELCOME_TO_PREMIUM) {
        return null;
      }

      return (
        <li key={item} className="mb-1">
          <Link to={item}>
            <Button
              variant="hover-only"
              className={
                pathName === item.toLowerCase() ||
                (pathName.includes(PrivateRoutes.APPS_PATH.toLowerCase()) &&
                  item === PrivateRoutes.APPS_PATH)
                  ? "bg-primary"
                  : ""
              }
            >
              {setIcon("text-light", 16)[item]}
              <span className="ml-4">{t(`menu.${item.slice(1).toLowerCase()}`)}</span>
            </Button>
          </Link>
        </li>
      );
    },
    [pathName, t],
  );

  return (
    <aside
      className={twMerge(
        "max-w-68 w-full transparent-bg flex md:hidden flex-col justify-between flex-1",
        className,
      )}
    >
      <div className="h-full p-default  overflow-y-auto flex flex-col justify-between no-scrollbar">
        <nav className="mb-10 flex-1">
          <ul className="text-light">
            {Object.values(PrivateRoutes).slice(1).map(renderNavigationLink)}
            <Logout variant="hover-only" size="default"/>
          </ul>
        </nav>
        <Envelop/>
      </div>
    </aside>
  );
};
