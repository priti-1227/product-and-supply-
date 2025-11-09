import React, { Suspense } from 'react'; // 1. Import Suspense
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Box, CircularProgress } from '@mui/material'; // For the loading fallback

// 2. Import layouts, public pages, and helpers normally
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// 3. LAZY-LOAD all your protected pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const SuppliersList = React.lazy(() => import('./pages/suppliers/SuppliersList'));
const AddSupplier = React.lazy(() => import('./pages/suppliers/AddSupplier'));
const EditSupplier = React.lazy(() => import('./pages/suppliers/EditSupplier'));
const ItemsList = React.lazy(() => import('./pages/items/ItemsList'));
const AddItem = React.lazy(() => import('./pages/items/AddItem'));
const EditItem = React.lazy(() => import('./pages/items/EditItem'));
const SupplierListUpload = React.lazy(() => import('./pages/SupplierListUpload'));
const QuotationListPage = React.lazy(() => import('./pages/quotations/QuotationListPage'));
const CreateQuotationPage = React.lazy(() => import('./pages/quotations/CreateQuotationPage'));

// 4. Create a loading fallback component
const PageLoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

export default function App() {
  const { isLoading } = useAuth();

  // Your global auth check (this is correct)
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      {/* 5. Wrap your <Routes> in a <Suspense> component */}
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* All your lazy-loaded routes go here */}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}