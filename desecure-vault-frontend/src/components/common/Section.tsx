import React, { ReactNode } from 'react'

const Section = ({
  title,
  action,
  children,
  className = '',
  style = {},
}: {
  title?: string,
  action?: ReactNode,
  children: ReactNode,
  className?: string,
  style?: React.CSSProperties,
}) => {
  return (
    <section className={`content-section ${className}`} style={style}>
      {title ? (
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <div className="section-actions">
            {action}
          </div>
        </div>
      ) : ""}

      {children}
    </section>
  )
}

export default Section
