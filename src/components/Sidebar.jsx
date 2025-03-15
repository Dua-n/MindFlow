import React from 'react';
import { CustomIcon } from './CustomIcon';

const Sidebar = ({
  activeTab,
  setActiveTab,
  toggleDarkMode,
  toggleAssistant,
  sidebarOpen,
  toggleSidebar,
  colors,
}) => (
  <div
    className={`sidebar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 md:relative absolute z-40 flex flex-col w-64 h-full p-4 rounded-r-3xl shadow-lg`}
    style={{ background: colors.cardBg, color: colors.text }}
  >
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">Mindflow</h1>
      <button onClick={toggleDarkMode} style={{ color: colors.accent }}>
        <CustomIcon type="mode" />
      </button>
    </div>
    <nav className="flex-grow">
      <ul className="space-y-1">
        <li>
          <button
            className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "journal" ? "font-medium" : ""}`}
            onClick={() => setActiveTab("journal")}
            style={{
              background:
                activeTab === "journal"
                  ? colors.cardHighlight
                  : "transparent",
              color: activeTab === "journal" ? colors.primary : colors.text,
            }}
          >
            <span className="mr-3">
              <CustomIcon type="journal" />
            </span>
            <span>Journal</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "projects" ? "font-medium" : ""}`}
            onClick={() => setActiveTab("projects")}
            style={{
              background:
                activeTab === "projects"
                  ? colors.cardHighlight
                  : "transparent",
              color: activeTab === "projects" ? colors.primary : colors.text,
            }}
          >
            <span className="mr-3">
              <CustomIcon type="projects" />
            </span>
            <span>Projects</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "focus" ? "font-medium" : ""}`}
            onClick={() => setActiveTab("focus")}
            style={{
              background:
                activeTab === "focus" ? colors.cardHighlight : "transparent",
              color: activeTab === "focus" ? colors.primary : colors.text,
            }}
          >
            <span className="mr-3">
              <CustomIcon type="focus" />
            </span>
            <span>Focus</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "admin" ? "font-medium" : ""}`}
            onClick={() => setActiveTab("admin")}
            style={{
              background:
                activeTab === "admin" ? colors.cardHighlight : "transparent",
              color: activeTab === "admin" ? colors.primary : colors.text,
            }}
          >
            <span className="mr-3">
              <CustomIcon type="admin" />
            </span>
            <span>Admin</span>
          </button>
        </li>
        <li>
          <button
            className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "reflection" ? "font-medium" : ""}`}
            onClick={() => setActiveTab("reflection")}
            style={{
              background:
                activeTab === "reflection"
                  ? colors.cardHighlight
                  : "transparent",
              color: activeTab === "reflection" ? colors.primary : colors.text,
            }}
          >
            <span className="mr-3">
              <CustomIcon type="reflection" />
            </span>
            <span>Reflection</span>
          </button>
        </li>
      </ul>
    </nav>
    
    {/* System Overview Section */}
    <div
      className="p-3 rounded-xl"
      style={{ background: colors.cardHighlight }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">System Overview:</h3>
        <span className="text-xs">Feb 25, 2025</span>
      </div>
      <ul className="text-sm space-y-2">
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <div>
            <span style={{ color: colors.primary }}>Priority:</span> Art
            Exhibition (35% complete)
            <div className="text-xs opacity-70 mt-1">
              Needs attention - Progress stalled for 5 days
            </div>
          </div>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <div>
            <span style={{ color: colors.primary }}>Upcoming:</span> Studio
            rent payment (3 days)
          </div>
        </li>
      </ul>
      <div className="mt-4">
        <button
          className="w-full py-2 rounded-xl text-sm"
          style={{ background: colors.buttonBg, color: colors.buttonText }}
          onClick={toggleAssistant}
        >
          Ask me anything...
        </button>
      </div>
    </div>
    
    {/* Mobile close button */}
    {sidebarOpen && (
      <button
        className="md:hidden absolute top-4 right-4"
        onClick={toggleSidebar}
      >
        <CustomIcon type="close" />
      </button>
    )}
  </div>
);

export default Sidebar; 