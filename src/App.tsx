import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import TasksAndLocations from './pages/TasksAndLocations';
import Reports from './pages/Reports';
import InspectionHistory from './pages/InspectionHistory';
import DroneSchedule from './pages/DroneSchedule';
import Inspection from './pages/Inspection';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<TasksAndLocations />} />
        <Route path="inspection" element={<Inspection />} />
        <Route path="drone-schedule" element={<DroneSchedule />} />
        <Route path="reports" element={<Reports />} />
        <Route path="history" element={<InspectionHistory />} />
      </Route>
    </Routes>
  );
}