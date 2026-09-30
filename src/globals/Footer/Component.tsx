import FooterClient from './Component.client'
import { getFooter } from '@/lib/content'

export async function Footer() {
  const footerData = getFooter()
  return <FooterClient data={footerData} />
}
