import React from 'react'
import CatalogueNavbar from '../Catalogue/CatalogueNavbar'
import CompanyDashboard from './CompanyDashboard'
import CompanyBoundNavbar from './CompanyBoundNavbar'

const Company = () => {
  return (
    <div>
        <CatalogueNavbar />
        <CompanyBoundNavbar />
        <CompanyDashboard />
    </div>
  )
}

export default Company