import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DestinationsPage from "@/pages/destinations-page";
import DestinationDetails from "@/pages/destination-details";
import HotelsPage from "@/pages/hotels-page";
import HotelDetails from "@/pages/hotel-details";
import PackagesPage from "@/pages/packages-page";
import PackageDetails from "@/pages/package-details";
import CruisesPage from "@/pages/cruises-page";
import CruiseDetails from "@/pages/cruise-details";
import CabsPage from "@/pages/cabs-page";
import CabDetails from "@/pages/cab-details";
import EventsPage from "@/pages/events-page";
import EventDetails from "@/pages/event-details";
import BookingsPage from "@/pages/bookings-page";
import BookingDetails from "@/pages/booking-details";
import CheckoutPage from "@/pages/checkout-page";
import ProfilePage from "@/pages/profile-page";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";
import CookiePolicyPage from "@/pages/cookie-policy";
import AdminAuth from "@/pages/admin/admin-auth-page";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminDestinations from "@/pages/admin/admin-destinations";
import AdminPackages from "@/pages/admin/admin-packages";
import AdminHotels from "@/pages/admin/admin-hotels";
import AdminCabs from "@/pages/admin/admin-cabs";
import AdminCruises from "@/pages/admin/admin-cruises";
import AdminEvents from "@/pages/admin/admin-events";
import AdminBookings from "@/pages/admin/admin-bookings";
import AdminSettings from "@/pages/admin/admin-settings";
import AdminMessages from "@/pages/admin/admin-messages";
import AdminReviews from "@/pages/admin/admin-reviews";
import AdminDrivers from "@/pages/admin/admin-drivers";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "@/lib/scroll-to-top";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/destinations" component={DestinationsPage} />
      <Route path="/destinations/:id" component={DestinationDetails} />
      <Route path="/hotels" component={HotelsPage} />
      <Route path="/hotels/:id" component={HotelDetails} />
      <Route path="/packages" component={PackagesPage} />
      <Route path="/packages/:id" component={PackageDetails} />
      <Route path="/cruises" component={CruisesPage} />
      <Route path="/cruises/:id" component={CruiseDetails} />
      <Route path="/cabs" component={CabsPage} />
      <Route path="/cabs/:id" component={CabDetails} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetails} />
      
      {/* Policy Pages */}
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/cookie-policy" component={CookiePolicyPage} />
      
      <ProtectedRoute path="/bookings" component={BookingsPage} />
      <ProtectedRoute path="/bookings/:id" component={BookingDetails} />
      <ProtectedRoute path="/checkout/:type/:id" component={CheckoutPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      <Route path="/admin-auth" component={AdminAuth} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly />
      <ProtectedRoute path="/admin/destinations" component={AdminDestinations} adminOnly />
      <ProtectedRoute path="/admin/packages" component={AdminPackages} adminOnly />
      <ProtectedRoute path="/admin/hotels" component={AdminHotels} adminOnly />
      <ProtectedRoute path="/admin/cabs" component={AdminCabs} adminOnly />
      <ProtectedRoute path="/admin/cruises" component={AdminCruises} adminOnly />
      <Route path="/admin-cruises" component={AdminCruises} />
      <ProtectedRoute path="/admin/events" component={AdminEvents} adminOnly />
      <ProtectedRoute path="/admin/bookings" component={AdminBookings} adminOnly />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} adminOnly />
      <ProtectedRoute path="/admin/messages" component={AdminMessages} adminOnly />
      <ProtectedRoute path="/admin/reviews" component={AdminReviews} adminOnly />
      <ProtectedRoute path="/admin/drivers" component={AdminDrivers} adminOnly />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="travel-ease-theme">
        <AuthProvider>
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
