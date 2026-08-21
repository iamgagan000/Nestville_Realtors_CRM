import React, { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  MapPin,
  TrendingUp,
  UserRoundPlus,
} from "lucide-react";

import api from "../../api";
import Page from "../../components/ui/Page/Page";
import Stat from "../../components/ui/Stat/Stat";
import Card from "../../components/ui/Card/Card";
import Quick from "../../components/ui/Quick/Quick";
import { stages } from "../../constants/menu";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");

        if (mounted) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const s = data?.stats || {};

  return (
    <Page
      title="Dashboard"
      subtitle="Your real-estate business at a glance."
    >
      <div className="stats">
        <Stat
          label="Total Leads"
          value={s.leads || 0}
          icon={UserRoundPlus}
        />

        <Stat
          label="Properties"
          value={s.properties || 0}
          icon={Building2}
        />

        <Stat
          label="Open Deals"
          value={s.deals || 0}
          icon={CircleDollarSign}
        />

        <Stat
          label="Bookings"
          value={s.bookings || 0}
          icon={CalendarDays}
        />

        <Stat
          label="Pending Tasks"
          value={s.pendingTasks || 0}
          icon={CheckSquare}
        />

        <Stat
          label="Follow Ups"
          value={s.followUps || 0}
          icon={Bell}
        />

        <Stat
          label="Site Visits"
          value={s.siteVisits || 0}
          icon={MapPin}
        />

        <Stat
          label="Booked Revenue"
          value={`₹${((s.revenue || 0) / 100000).toFixed(1)}L`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid-2">
        <Card title="Sales Pipeline">
          <div className="pipeline">
            {stages.slice(0, 7).map((stage) => {
              const pipelineItem = data?.pipeline?.find(
                (item) => item._id === stage
              );

              const count = pipelineItem?.count || 0;
              const value = pipelineItem?.value || 0;

              return (
                <div className="pipeline-col" key={stage}>
                  <b>{stage}</b>

                  <div className="pipeline-count">
                    {count}
                  </div>

                  <small>
                    ₹{(value / 100000).toFixed(1)}L
                  </small>

                  <div
                    className="mini-bar"
                    style={{
                      width: `${Math.min(
                        100,
                        20 + count * 12
                      )}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="quick-actions">
            <Quick
              to="/leads"
              icon={UserRoundPlus}
              text="Add Lead"
            />

            <Quick
              to="/properties"
              icon={Building2}
              text="Add Property"
            />

            <Quick
              to="/tasks"
              icon={CheckSquare}
              text="Create Task"
            />

            <Quick
              to="/bookings"
              icon={CalendarDays}
              text="New Booking"
            />
          </div>
        </Card>
      </div>

      <Card title="Business workflow">
        <div className="workflow">
          {[
            "Lead",
            "Contact",
            "Follow Up",
            "Site Visit",
            "Deal",
            "Booking",
          ].map((step, index) => (
            <div key={step}>
              <span>{index + 1}</span>
              <b>{step}</b>
              {index < 5 && <em>→</em>}
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

export default Dashboard;
