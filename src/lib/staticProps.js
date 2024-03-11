export default async function staticProps(context, page) {
  return {
    props: {
      messages: (await import(`../locales/${page}/${context.locale}.json`))
        .default,
    },
  }
}
