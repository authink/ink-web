import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'

export default function LocaleSwitcher(props) {
  const t = useTranslations('switchLocale')

  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale)

  return (
    <Link href={route} locale={otherLocale} style={{ textDecoration: 'none' }}>
      <span {...props}>{t('locale')}</span>
    </Link>
  )
}
