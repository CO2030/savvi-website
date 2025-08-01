import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import SimpleAdmin from "@/pages/SimpleAdmin";
import Demo from "@/pages/Demo";
import ContactPage from "@/pages/ContactPage";
import Story from "./pages/Story";
import FAQPage from "@/pages/FAQ";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import FiveDayMeals from "@/pages/FiveDayMeals";
import MealGuide from "@/pages/MealGuide";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/demo" component={Demo} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={SimpleAdmin} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/story" component={Story} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/5-day-meals" component={FiveDayMeals} />
      <Route path="/meal-guide" component={MealGuide} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;