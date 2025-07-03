import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  ListTodo,
  BookOpen,
  Github,
  Timer,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="drawer lg:drawer-open font-inter min-h-full w-80">
      {/* Mobile Toggle */}
      <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col">
        {/* Top Navbar (Mobile Only) */}
        <div className="w-full navbar bg-base-100 lg:hidden px-4 shadow">
          <label
            htmlFor="sidebar-toggle"
            className="btn btn-primary drawer-button"
          >
            ☰
          </label>
          <Link
            to="#"
            className="flex items-center gap-2 font-bold text-lg ml-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-sidebar-foreground">DevPulse</span>
          </Link>
        </div>

       
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="sidebar-toggle" className="drawer-overlay"></label>
        <aside className="w-80 min-h-full bg-base-200 text-base-content flex flex-col">
          {/* Sidebar Logo */}
          <div className="flex h-16 items-center px-6 border-b border-gray-300 bg-base-200 min-h-full w-80">
            <Link to="#" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-sidebar-foreground">DevPulse</span>
            </Link>
          </div>

          {/* Menu Items */}
          <ul className="menu p-4 flex-1 gap-2 bg-base-200 min-h-full w-80">
            <li>
              <Link to="/" className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/tasks" className="flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                Tasks
              </Link>
            </li>
            <li>
              <Link to="/learnings" className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Log
              </Link>
            </li>
            <li>
              <Link to="/promodoro" className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                Pomodoro
              </Link>
            </li>
             <li>
              <Link to="/githubtracker" className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Tracker
              </Link>
            </li>
          </ul>

          {/* Footer Link */}
          <div className="px-4 pb-4 bg-base-200 min-h-full w-80">
            <Link
              to="#"
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-base-300 transition"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Sidebar;
