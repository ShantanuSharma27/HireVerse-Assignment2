import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PrincipalDashboard from "./Dashboards/PrincipalDashboard";
import TeacherDashboard from "./Dashboards/TeacherDashboard";
import StudentDashboard from "./Dashboards/StudentDashboard";
import Classrooms from "./Dashboards/Classrooms"
import TimeTable from "./Dashboards/TimeTable"
import "./Dashcomponents/dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get("view");

  let content;
  switch (view) {
    case "principal":
      content = <PrincipalDashboard />;
      break;
    case "teacher":
      content = <TeacherDashboard />;
      break;
    case "student":
      content = <StudentDashboard />;
      break;
    case "classrooms":
      content = <Classrooms />;
      break;
    case "timetable":
        content=<TimeTable/>
        break;
    default:
      content = <PrincipalDashboard />; // Default to PrincipalDashboard or show an error
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <Navbar />
      <section className="home">
        <div style={{ marginTop: "100px" }}>
          <div className="overview_container">
            {content}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
