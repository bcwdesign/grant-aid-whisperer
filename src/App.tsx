import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import Pipeline from "./pages/Pipeline";
import CalendarPage from "./pages/CalendarPage";
import Sources from "./pages/Sources";
import OrgProfile from "./pages/OrgProfile";
import SettingsPage from "./pages/SettingsPage";
import GrantDetail from "./pages/GrantDetail";
import AgentRuns from "./pages/AgentRuns";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="sources" element={<Sources />} />
            <Route path="profile" element={<OrgProfile />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="grants/:id" element={<GrantDetail />} />
            <Route path="admin/runs" element={<AgentRuns />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
