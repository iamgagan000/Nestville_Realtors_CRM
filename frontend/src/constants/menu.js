import { BarChart3, Bell, Building2, CalendarDays, CheckSquare, CircleDollarSign, LayoutDashboard, MapPin, Settings as SettingsIcon, Users, UserRoundPlus } from "lucide-react";

export const menu = [
  ["Dashboard", "/", LayoutDashboard],
  ["Leads", "/leads", UserRoundPlus],
  ["Contacts", "/contacts", Users],
  ["Properties", "/properties", Building2],
  ["Deals", "/deals", CircleDollarSign],
  ["Bookings", "/bookings", CalendarDays],
  ["Tasks", "/tasks", CheckSquare],
  ["Follow Ups", "/follow-ups", Bell],
  ["Site Visits", "/site-visits", MapPin],
  ["Reports & Analytics", "/reports", BarChart3],
  ["Users & Roles", "/users", Users],
  ["Settings", "/settings", SettingsIcon],
];

export const stages = ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Booking", "Won", "Lost"];
