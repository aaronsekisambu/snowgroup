'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import type { PriceListBlock as PriceListBlockProps } from '@/types/content'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

const formatUpdated = (value?: string) => {
  if (!value) return null
  const date = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

// Prices from src/data/price-list.json: a tab per table, or a single table on a product page.
// Every table is in the HTML (inactive ones hidden) so search engines can read all prices.
export const PriceListBlock: React.FC<PriceListBlockProps> = ({
  badge,
  title,
  description,
  price_list,
  show_extras,
  button_text,
  button_url,
}) => {
  const tables = price_list?.tables || []
  const [active, setActive] = useState(0)
  const updated = formatUpdated(price_list?.updated)
  const tableIds = tables.map((table) => table.id).join(' ')

  // /price-list#pavers opens the Pavers tab
  useEffect(() => {
    const index = tableIds.split(' ').indexOf(window.location.hash.slice(1))
    if (index > 0) setActive(index)
  }, [tableIds])

  if (!tables.length) return null

  const single = tables.length === 1
  const heading = single ? tables[0].title || title : title
  const intro = single ? tables[0].description || description : description

  const notes = price_list?.notes && price_list.notes.length > 0 && (
    <div className="mil-price-panel">
      <h6 className="mil-mb-3">Good to know</h6>
      <ul className="mil-price-notes">
        {price_list.notes.map((note) => (
          <li key={note} className="mil-t-14 mil-c-m-2">{note}</li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="mil-section mil-gray-section mil-p-10-8" id="prices">
      <div className="container">
        <div className="row mil-aie mil-mb-5">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
            {heading && <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(heading) }} />}
          </div>
          <div className="col-12 col-md-6">
            {intro && <p className="mil-c-m-2 mil-t-16 mil-mb-2">{intro}</p>}
            <p className="mil-price-meta">
              Prices in {price_list?.currency || 'UGX'}
              {updated && <> · Updated {updated}</>}
            </p>
          </div>
        </div>

        {!single && (
          <div className="mil-filter mil-mb-5" role="tablist" aria-label="Price lists">
            {tables.map((table, i) => (
              <button
                key={table.id}
                type="button"
                role="tab"
                id={`tab-${table.id}`}
                aria-controls={`panel-${table.id}`}
                aria-selected={i === active}
                className={i === active ? 'mil-active' : ''}
                onClick={() => {
                  setActive(i)
                  window.history.replaceState(null, '', `#${table.id}`)
                }}
              >
                {table.label}
              </button>
            ))}
          </div>
        )}

        {tables.map((table, i) => (
          <div
            key={table.id}
            id={`panel-${table.id}`}
            role={single ? undefined : 'tabpanel'}
            aria-labelledby={single ? undefined : `tab-${table.id}`}
            hidden={i !== active}
          >
            <div className="mil-price-card">
              {!single && table.description && <p className="mil-c-m-2 mil-t-14 mil-mb-4">{table.description}</p>}
              <table className="mil-price-table">
                <caption className="mil-price-caption">{table.label} prices</caption>
                <thead>
                  <tr>
                    {table.columns.map((column) => (
                      <th key={column} scope="col">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, c) =>
                        c === 0 ? (
                          <th key={c} scope="row">{cell}</th>
                        ) : (
                          <td key={c} data-label={table.columns[c]}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {table.rules && table.rules.length > 0 && (
                <div className="mil-price-rules">
                  {table.rules_title && <h6 className="mil-mb-2">{table.rules_title}</h6>}
                  <ul>
                    {table.rules.map((rule) => (
                      <li key={rule} className="mil-t-14 mil-c-m-2">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {(show_extras || (button_text && button_url)) && (
          <div className="row mil-price-extras">
            {show_extras ? (
              <>
                <div className="col-lg-6 mil-mb-2">
                  <div className="mil-price-stack">
                    {notes}
                    {price_list?.contacts && price_list.contacts.length > 0 && (
                      <div className="mil-price-panel mil-price-panel-dark">
                        {price_list.contacts_title && <h6 className="mil-mb-3">{price_list.contacts_title}</h6>}
                        <ul className="mil-price-contacts">
                          {price_list.contacts.map((contact) => (
                            <li key={contact.name || contact.label}>
                              <div className="mil-price-avatar">
                                {contact.image?.url ? (
                                  <Media resource={contact.image} size="64px" />
                                ) : (
                                  // placeholder until a photo is added in price-list.json
                                  <span aria-hidden="true">
                                    <i className="fal fa-user"></i>
                                  </span>
                                )}
                              </div>
                              <div>
                                {contact.name && <strong>{contact.name}</strong>}
                                <span className="mil-t-14">{contact.label}</span>
                                {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {price_list?.samples?.image?.url && (
                  <div className="col-lg-6 mil-mb-2">
                    <div className="mil-price-panel">
                      {price_list.samples.title && <h6 className="mil-mb-2">{price_list.samples.title}</h6>}
                      {price_list.samples.description && <p className="mil-t-14 mil-c-m-2 mil-mb-3">{price_list.samples.description}</p>}
                      <a href={price_list.samples.image.url} target="_blank" rel="noopener" className="mil-price-samples">
                        <Media resource={price_list.samples.image} size="(max-width: 992px) 100vw, 560px" />
                        <span className="mil-t-14">Open full size</span>
                      </a>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="col-lg-8 mil-mb-2">{notes}</div>
                <div className="col-lg-4 mil-mb-2">
                  <div className="mil-price-panel mil-price-panel-dark mil-price-cta">
                    <p className="mil-t-16 mil-mb-3">Blocks, pavers and machinery hire, all on one page.</p>
                    <Link href={button_url || '/price-list'} className="mil-btn mil-link-type">
                      <span>{button_text}</span>
                      <i className="far fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
