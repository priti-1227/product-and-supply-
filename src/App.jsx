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
import QuotationListPage from "./pages/quotations/QuotationListPage"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./context/AuthContext"
import { Box, CircularProgress } from "@mui/material"


export default function App() {
  const { isLoading } = useAuth(); // 3. Get the loading state

  // 4. Show a global spinner while the AuthContext is checking localStorage
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
  <BrowserRouter>
      {/* You only need one <Routes> component */}
      <Routes>
        {/* 1. This is your public login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2. This is your protected layout route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 3. All your app routes go here as direct children */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="suppliers" element={<SuppliersList />} />
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="suppliers/edit/:id" element={<EditSupplier />} />
          <Route path="items" element={<ItemsList />} />
          <Route path="items/add" element={<AddItem />} />
          <Route path="items/edit/:id" element={<EditItem />} />
          <Route path="supplier-list" element={<SupplierListUpload />} />
          <Route path="quotations" element={<QuotationListPage />} />
          <Route path="quotations/create" element={<CreateQuotationPage />} />
        </Route>

        {/* 4. This catch-all route redirects any unknown URL to your dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
