import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashcomponents/dashboard.css";

function Sidebar() {
  const navigate = useNavigate();

  // Retrieve and parse the user info from local storage
  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;

  // Access the role from the parsed user object
  const role = user?.user?.role;

  useEffect(() => {
    if (!role) {
      navigate("/login"); // Redirect to login if role is not found
    } else {
      // Redirect based on role
      switch (role) {
        case "principal":
          navigate("/dashboard?view=principal");
          break;
        case "teacher":
          navigate("/dashboard?view=teacher");
          break;
        case "student":
          navigate("/dashboard?view=student");
          break;
        default:
          navigate("/login"); // Redirect to login if the role is unrecognized
          break;
      }
    }
  }, [role, navigate]);

  return (
    <>
      <input id="menu__toggle" type="checkbox" />
      <label className="menu__btn" htmlFor="menu__toggle">
        <span></span>
      </label>
      <nav className="sidebar">
        <header>
          <div className="image-text">
            <div className="text logo-text">
              <span className="name">Classroom-of-the-elite</span>
            </div>
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              {role === "principal" && (
                <>
                  <li className="nav-link">
                    <Link to="/dashboard?view=principal">
                      <i className="fa-sharp fa-solid fa-gauge-high icon"></i>
                      <span className="text nav-text">Principal Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard?view=teacher">
                      <i className="fa-sharp fa-solid fa-chalkboard-teacher icon"></i>
                      <span className="text nav-text">Teacher Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard?view=student">
                      <i className="fa-sharp fa-solid fa-user-graduate icon"></i>
                      <span className="text nav-text">Student Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard?view=classrooms">
                      <i className="fa-sharp fa-solid fa-user-graduate icon"></i>
                      <span className="text nav-text">Classrooms</span>
                    </Link>
                  </li>
                </>
              )}

              {role === "teacher" && (
                <>
                  <li className="nav-link">
                    <Link to="/dashboard?view=teacher">
                      <i className="fa-sharp fa-solid fa-chalkboard-teacher icon"></i>
                      <span className="text nav-text">Teacher Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard?view=student">
                      <i className="fa-sharp fa-solid fa-user-graduate icon"></i>
                      <span className="text nav-text">Student Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard?view=timetable">
                      <i className="fa-sharp fa-solid fa-user-graduate icon"></i>
                      <span className="text nav-text">TimeTable</span>
                    </Link>
                  </li>
                </>
              )}

              {role === "student" && (
                <>
                  <li className="nav-link">
                    <Link to="/dashboard?view=student">
                      <i className="fa-sharp fa-solid fa-user-graduate icon"></i>
                      <span className="text nav-text">Student Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard?view=timetable">
                      <i className="fa-sharp fa-solid fa-user-graduate icon"></i>
                      <span className="text nav-text">TimeTable</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="bottom-content">
            <li className="nav-link">
              <Link to="/">
                <i className="fa-sharp fa-solid fa-right-from-bracket icon"></i>
                <span className="text nav-text">Logout</span>
              </Link>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
