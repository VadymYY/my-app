import {FC, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";

import {guides} from "constants/guides.constants";

import {GuideHeader} from "components/guides/guide-header";

const GuidePage: FC = () => {
  const {guide} = useParams<{ guide: string }>();
  const {t} = useTranslation();

  const guideKey = guide?.split("-guide")[0] as keyof typeof guide;

  const guideData = useMemo(() => guides[guideKey], [guideKey]);

  return (
    <section
      aria-label={t(guideData.title)}
      className="px-9 md:px-4 py-10 md:py-5 w-full max-w-5xl overflow-y-auto no-scrollbar"
    >
      <GuideHeader title={guideData.title}/>
      <div className="py-5">{guideData.content}</div>
    </section>
  );
};

export default GuidePage;
