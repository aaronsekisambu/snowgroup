import type { Metadata } from 'next'
import React, { Fragment } from 'react'
import { notFound } from 'next/navigation'
import type { Page } from '@/types/content'
import { getPageBySlug } from '@/lib/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './[slug]/page.client'

export default async function HomePage(): Promise<React.ReactElement> {
	const page: Page | null = getPageBySlug('home-5')

	if (!page) notFound()

	return (
		<Fragment>
			<PageClient page={page} />
			<RenderBlocks blocks={page.layout || []} />
		</Fragment>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	return generateMeta({ doc: getPageBySlug('home-5') })
}
