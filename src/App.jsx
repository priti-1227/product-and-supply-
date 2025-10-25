import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import SuppliersList from "./pages/suppliers/SuppliersList"
import AddSupplier from "./pages/suppliers/AddSupplier"
import EditSupplier from "./pages/suppliers/EditSupplier"

import SupplierListUpload from "./pages/SupplierListUpload"
// import Quotations from "./pages/Quotations"
import MainLayout from "./components/layout/MainLayout"
import ItemsList from "./pages/items/ItemsList"
import AddItem from "./pages/items/AddItem"
import EditItem from "./pages/items/EditItem"
import CreateQuotationPage from "./pages/quotations/CreateQuotationPage"

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="suppliers" element={<SuppliersList />} />
        <Route path="suppliers/add" element={<AddSupplier />} />
       <Route path="suppliers/edit/:id" element={<EditSupplier />} />
        <Route path="items" element={<ItemsList />} />
        <Route path="items/add" element={<AddItem />} />
        <Route path="items/edit/:id" element={<EditItem />} />
      <Route path="supplier-list" element={<SupplierListUpload />} />
           <Route path="quotations" element={<CreateQuotationPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}
