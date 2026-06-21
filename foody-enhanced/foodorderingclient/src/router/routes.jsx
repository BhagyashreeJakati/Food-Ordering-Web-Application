import { createBrowserRouter } from 'react-router-dom';
import Root from './root';
import Home from '../pages/home/Home';
import Restaurant from '../pages/Restaurant/Restaurant';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Profile from '../pages/Profile/Profile';
import Auth from '../components/Auth/Auth';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import UserProfile from '../pages/Profile/UserProfile';
import Orders from '../pages/Profile/Orders';
import Favorites from '../pages/Profile/Favorites';
import Address from '../pages/Profile/Address';
import ChangePassword from '../pages/Profile/ChangePassword';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminRestaurant from '../pages/Admin/AdminRestaurant';
import AdminFood from '../pages/Admin/AdminFood';
import AdminOrders from '../pages/Admin/AdminOrders';
import AdminAnalytics from '../pages/Admin/AdminAnalytics';
import PaymentSuccess from '../pages/Cart/PaymentSuccess';
import OrderTracking from '../pages/OrderTracking/OrderTracking';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import NotFound from '../pages/NotFound/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '/account/*', element: <Auth /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '*', element: <NotFound /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: 'payment/success', element: <PaymentSuccess /> },
          { path: 'restaurant/:restaurantId', element: <Restaurant /> },
          { path: 'cart', element: <Cart /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'orders/track/:orderId', element: <OrderTracking /> },
          {
            path: 'profile',
            element: <Profile />,
            children: [
              { index: true, element: <UserProfile /> },
              { path: 'orders', element: <Orders /> },
              { path: 'favorites', element: <Favorites /> },
              { path: 'address', element: <Address /> },
              { path: 'change-password', element: <ChangePassword /> },
            ],
          },
          {
            path: 'admin',
            element: <AdminRoute />,
            children: [
              {
                element: <AdminDashboard />,
                children: [
                  { index: true, element: <AdminRestaurant /> },
                  { path: 'food', element: <AdminFood /> },
                  { path: 'orders', element: <AdminOrders /> },
                  { path: 'analytics', element: <AdminAnalytics /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
export default router;
