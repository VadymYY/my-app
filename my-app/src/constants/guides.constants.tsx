import {AppType, GuideType} from "enums/common.enums";
import {twMerge} from "tailwind-merge";

import {AndroidBoxIcon} from "assets/icons/android-box.icon";
import {AndroidMobileIcon} from "assets/icons/android-mobile.icon";
import {EmbyIcon} from "assets/icons/emby.icon";
import {FirestickIcon} from "assets/icons/firestick.icon";
import {IptvIcon} from "assets/icons/iptv.icon";
import {KodiIcon} from "assets/icons/kodi.icon";
import {TvIcon} from "assets/icons/tv.icon";
import startupShowImage from "assets/images/startup-show.png";

import {EmbyGuide} from "components/guides/emby.component";
import {FirestickGuide} from "components/guides/firestick.component";
import {FlexIptvGuide} from "components/guides/flex-iptv.component";
import {KodiGuide} from "components/guides/kodi.component";
import {SmartersGuide} from "components/guides/smarters.component";
import {TivimateGuide} from "components/guides/tivimate.component";

const iconStyles = "w-10 h-10 text-white";

export const appsIcon: { [key: string]: React.ReactNode } = {
  [AppType.ANDROID_MOBILE]: <AndroidMobileIcon className={iconStyles}/>,
  [AppType.ANDROID_TV]: <AndroidBoxIcon className={iconStyles}/>,
  [AppType.ANDROID_BOX]: <AndroidBoxIcon className={iconStyles}/>,
  [GuideType.EMBY]: <EmbyIcon className={iconStyles}/>,
  [GuideType.FLEX_IPTV]: <IptvIcon className={iconStyles}/>,
  [GuideType.FIRESTICK]: <FirestickIcon className={iconStyles}/>,
  [GuideType.KODI]: <KodiIcon className={twMerge(iconStyles, "w-20")}/>,
  [GuideType.GSE_IPTV_SMARTERS]: <IptvIcon className={iconStyles}/>,
  [GuideType.TIVIMATE]: <TvIcon className={twMerge(iconStyles, "w-20")}/>,
};

export const recommendedAppsDataImage = {
  "Startup show": startupShowImage,
};

const BASE_LINK = "https://best/api/list/YOUR_EMAIL/PASSWORD/m6pu8";
export const liveTvLink = `${BASE_LINK}/livetv`;
export const moviesLink = `${BASE_LINK}/movies`;
export const tvShowsLink = `${BASE_LINK}/tvshows`;

export const regularVersionLink = "https://best/api/epg/YOUR_EMAIL/PASSWORD";
export const liteVersionLink = "https://best-lite/api/epg/YOUR_EMAIL/PASSWORD";

export const guides: { [key: string]: { content: React.ReactNode; title: string } } = {
  [GuideType.EMBY]: {title: "guides.emby", content: <EmbyGuide/>},
  [GuideType.FLEX_IPTV]: {title: "guides.flexIptv", content: <FlexIptvGuide/>},
  [GuideType.FIRESTICK]: {title: "guides.firestick", content: <FirestickGuide/>},
  [GuideType.KODI]: {title: "guides.kodi", content: <KodiGuide/>},
  [GuideType.GSE_IPTV_SMARTERS]: {title: "guides.smart", content: <SmartersGuide/>},
  [GuideType.TIVIMATE]: {title: "guides.tivimate", content: <TivimateGuide/>},
};
