import React from 'react'
import '@/styles/app/dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons'

const App = () => {
  return (
    <>
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">Vault Overview</h2>
          <div className="section-actions">
            <button className="btn btn-outline">
              <FontAwesomeIcon icon={faSync} />
              <span>Refresh</span>
            </button>
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Items</div>
            <div className="stat-value">47</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Passwords</div>
            <div className="stat-value">32</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Payment Cards</div>
            <div className="stat-value">8</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Identities</div>
            <div className="stat-value">7</div>
          </div>
        </div>

        <div className="vault-items">
          <div className="vault-item">
            <div className="vault-item-header">
              <div className="vault-item-icon">
                <i className="fab fa-github"></i>
              </div>
              <div className="vault-item-menu">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
            <div className="vault-item-title">GitHub</div>
            <div className="vault-item-details">
              <i className="fas fa-user"></i>
              <span>johndoe@example.com</span>
            </div>
          </div>

          <div className="vault-item">
            <div className="vault-item-header">
              <div className="vault-item-icon">
                <i className="fab fa-google"></i>
              </div>
              <div className="vault-item-menu">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
            <div className="vault-item-title">Google</div>
            <div className="vault-item-details">
              <i className="fas fa-user"></i>
              <span>john.doe@gmail.com</span>
            </div>
          </div>

          <div className="vault-item">
            <div className="vault-item-header">
              <div className="vault-item-icon">
                <i className="fab fa-dropbox"></i>
              </div>
              <div className="vault-item-menu">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
            <div className="vault-item-title">Dropbox</div>
            <div className="vault-item-details">
              <i className="fas fa-user"></i>
              <span>johndoe@example.com</span>
            </div>
          </div>

          <div className="vault-item">
            <div className="vault-item-header">
              <div className="vault-item-icon">
                <i className="fab fa-slack"></i>
              </div>
              <div className="vault-item-menu">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
            <div className="vault-item-title">Slack</div>
            <div className="vault-item-details">
              <i className="fas fa-user"></i>
              <span>john@company.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Second Content Section --> */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">Recent Activity</h2>
          <div className="section-actions">
            <button className="btn btn-outline">
              <i className="fas fa-filter"></i>
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-plus"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Added new password for Amazon</div>
              <div className="activity-details">
                <span>Today at 2:45 PM</span>
                <span>Web Extension</span>
              </div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-edit"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Updated Netflix password</div>
              <div className="activity-details">
                <span>Yesterday at 7:30 PM</span>
                <span>Web App</span>
              </div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Shared Wi-Fi password with family</div>
              <div className="activity-details">
                <span>Mar 28, 2025</span>
                <span>Mobile App</span>
              </div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-sync-alt"></i>
            </div>
            <div className="activity-content">
              <div className="activity-title">Autofilled login for GitHub</div>
              <div className="activity-details">
                <span>Mar 27, 2025</span>
                <span>Web Extension</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>&copy; 2025 Shadow Vault. All rights reserved.</div>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Help</a>
        </div>
      </footer>
    </>
  )
}

export default App