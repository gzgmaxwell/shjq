// translate router.meta.title, be used in breadcrumb sidebar tagsview
import i18n from "@/lang/index";

// export function translateRouteTitleI18n(title: any) {
//   // 判断是否存在国际化配置，如果没有原生返回
//   const hasKey = i18n.global.te("route." + title);
//   if (hasKey) {
//     const translatedTitle = i18n.global.t("route." + title);
//     return translatedTitle;
//   }
//   return title;
// }

export function translateRouteTitleI18n(item: any) {
  // 判断是否存在国际化配置，如果没有原生返回
  const langKey = item.meta.langKey;
  const title = item.meta.title;
  const hasKey = i18n.global.te(langKey);
  if (hasKey) {
    const translatedTitle = i18n.global.t(langKey);
    return translatedTitle;
  }
  return title;
}

export const i18nTranLabel = (label: any) => {
  const isTe = i18n.global.te(`${label}`);
  const str = isTe ? i18n.global.t(label) : label;
  return str;
};

export const i18nTL = (label: string) => {
  const isTe = i18n.global.te(`${label}`);
  const str = isTe ? i18n.global.t(label) : label;
  return str;
};
