import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { Button } from 'antd'

export default function LocaleSwitcher() {
  const t = useTranslations('switchLocale')

  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale)

  return (
    <Link href={route} locale={otherLocale} style={{ textDecoration: 'none' }}>
      <Button
        type="text"
        style={{
          width: 80,
          height: 64,
          textAlign: 'center',
        }}
      >
        {t('locale')}
      </Button>
    </Link>
  )
}
