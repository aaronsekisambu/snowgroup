import { cn } from '@/utilities/ui'
import * as React from 'react'

const Pagination = ({ ...props }: React.ComponentProps<'nav'>) => (
  <nav
    aria-label="pagination"
    {...props}
  />
)

const PaginationContent: React.FC<
  { ref?: React.Ref<HTMLUListElement> } & React.HTMLAttributes<HTMLUListElement>
> = ({ ref, ...props }) => (
  <ul ref={ref} {...props} />
)

const PaginationItem: React.FC<
  { ref?: React.Ref<HTMLLIElement> } & React.HTMLAttributes<HTMLLIElement>
> = ({ className, ref, ...props }) => <li className={cn('', className)} ref={ref} {...props} />

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<'button'>

const PaginationLink = ({ isActive, ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    {...props}
  />
)

const PaginationPrevious = ({
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={props.disabled ? "mil-prjct-arrow mil-disabled" : "mil-prjct-arrow"}
    {...props}
  >
    <i className="far fa-arrow-left"></i>
    <span className="mil-link-style mil-ml-20">Prev page</span>
  </PaginationLink>
)

const PaginationNext = ({ ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={props.disabled ? "mil-prjct-arrow mil-disabled" : "mil-prjct-arrow"}
    {...props}
  >
    <span className="mil-link-style mil-mr-20">Next page</span>
    <i className="far fa-arrow-right"></i>
  </PaginationLink>
)

const PaginationEllipsis = ({ ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    {...props}
  >
    <span>...</span>
  </span>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
