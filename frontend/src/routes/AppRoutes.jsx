import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "../components/layout/Layout/Layout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Leads from "../pages/Leads/Leads";
import Contacts from "../pages/Contacts/Contacts";
import Properties from "../pages/Properties/Properties";
import Deals from "../pages/Deals/Deals";
import Bookings from "../pages/Bookings/Bookings";
import Tasks from "../pages/Tasks/Tasks";
import FollowUps from "../pages/FollowUps/FollowUps";
import SiteVisits from "../pages/SiteVisits/SiteVisits";
import Reports from "../pages/Reports/Reports";
import UsersRoles from "../pages/UsersRoles/UsersRoles";
import Settings from "../pages/Settings/Settings";

export default function AppRoutes({ onLogout }) {
  return (
    <Layout onLogout={onLogout}>
      <Routes>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Leads */}
        <Route
          path="/leads"
          element={<Leads />}
        />

        {/* Contacts */}
        <Route
          path="/contacts"
          element={<Contacts />}
        />

        {/* Properties */}
        <Route
          path="/properties"
          element={<Properties />}
        />

        {/* Deals */}
        <Route
          path="/deals"
          element={<Deals />}
        />

        {/* Bookings */}
        <Route
          path="/bookings"
          element={<Bookings />}
        />

        {/* Tasks */}
        <Route
          path="/tasks"
          element={<Tasks />}
        />

        {/* Follow Ups */}
        <Route
          path="/follow-ups"
          element={<FollowUps />}
        />

        {/* Site Visits */}
        <Route
          path="/site-visits"
          element={<SiteVisits />}
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* Users & Roles */}
        <Route
          path="/users"
          element={<UsersRoles />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* Any unknown CRM URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </Layout>
  );
}