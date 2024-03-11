export default async function staticProps(locale, page) {
  return {
    props: {
      messages: {
        ...(await import(`@/locales/${page}/${locale}.json`)).default,
        ...(await import(`@/locales/component/${locale}.json`)).default,
      },
    },
  }
}
