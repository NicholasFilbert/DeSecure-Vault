import React from 'react'
import '@/styles/app/dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Section from '@/components/common/Section'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { formatFileSize, formatDate } from '@/utils/common'
import axiosInstance from '@/utils/axios'
import { cookies } from 'next/headers'

const App = async () => {
  const cookieHeader = (await cookies()).toString()
  const stats = (
    await axiosInstance.post('/files/stats', {}, {
      headers: {
        Cookie: cookieHeader,
      },
    })
  ).data

  const categoryList = (
    await axiosInstance.post('/files/most-category-list', {}, {
      headers: {
        Cookie: cookieHeader,
      },
    })
  ).data

  const category = categoryList.length === 0 ? 'No Category' : categoryList[0].category || 'No category'
  const categoryTitle = `Most Used Category List (${category})`
  return (
    <>
      <Header title="Dashboard" />
      <Section title="Vault Overview" className='mb-8'>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total File</div>
            <div className="stat-value">{stats.totalFile}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Directory</div>
            <div className="stat-value">{stats.totalDir}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Latest File Size</div>
            <div className="stat-value">{formatFileSize(stats.latestFileSize)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Latest File Created Time</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{formatDate(stats.latestFileUploadDate)}</div>
          </div>
          <div className="stat-card" style={{ gridColumn: 'span 2' }}>
            <div className="stat-title">Latest File Name</div>
            <div className="stat-value">{stats.latestFileName}</div>
          </div>
        </div>
      </Section>

      <Section title={categoryTitle} className='mb-8'>
        <div className="w-full bg-bg-dark text-text-light p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border-color">
              <thead>
                <tr className="bg-bg-card">
                  <th className="py-3 px-4 border-b border-border-color text-left">Name</th>
                  <th className="py-3 px-4 border-b border-border-color text-left">Category</th>
                  <th className="py-3 px-4 border-b border-border-color text-left">Size</th>
                  <th className="py-3 px-4 border-b border-border-color text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {categoryList.map((category, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-bg-dark' : 'bg-bg-card hover:bg-bg-hover'}
                  >
                    <td className="py-2 px-4 border-b border-border-color">{category.name}</td>
                    <td className="py-2 px-4 border-b border-border-color">
                      
                    </td>
                    <td className="py-2 px-4 border-b border-border-color">{formatFileSize(category.size)}</td>
                    <td className="py-2 px-4 border-b border-border-color">{formatDate(category.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-text-muted text-sm">
            Total: {categoryList.length} Files
          </div>
        </div>
      </Section>
      <Footer />
    </>
  )
}

export default App