'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AdminLayout,
  AdminNavigationPage,
} from '../components/AdminLayout';

// Admin 9 Pages
import { AdminDashboardPage } from '../views/AdminDashboardPage';
import { UserManagementPage } from '../views/UserManagementPage';
import { UserDetailsPage } from '../views/UserDetailsPage';
import { RolesAccessPage } from '../views/RolesAccessPage';
import { SecurityAuditLogPage } from '../views/SecurityAuditLogPage';
import { SystemHealthPage } from '../views/SystemHealthPage';
import { AdminProfileSecurityPage } from '../views/AdminProfileSecurityPage';
import { CourseOversightPage } from '../views/CourseOversightPage';
import { AccessDeniedPage } from '../views/AccessDeniedPage';

// Admin Modals
import { ChangeRoleModal } from '../components/ChangeRoleModal';
import { DeactivateAccountModal } from '../components/DeactivateAccountModal';

// Shared APIs and Types
import { adminApi, mapBackendUserToUserAccount, mapBackendAuditToAuditEvent, mapBackendHealthToServiceHealth } from '../services/api/adminApi';
import { authApi } from '../services/api/authApi';
import { storage } from '../services/storageService';

import {
  UserAccount,
  UserRole,
  AuditEvent,
  ServiceHealthCheck,
  Course,
} from '../types';

export default function AdminApp() {
  const [currentAdmin, setCurrentAdmin] = useState<UserAccount | null>(() => storage.getAdminUser());
  const [adminPage, setAdminPage] = useState<AdminNavigationPage>('dashboard');
  const [adminNavParams, setAdminNavParams] = useState<Record<string, string>>({});

  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => storage.getUsers());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => storage.getAuditEvents());
  const [serviceHealth, setServiceHealth] = useState<ServiceHealthCheck[]>(() => storage.getServiceHealth());
  const [courses] = useState<Course[]>(() => storage.getCourses());

  // Modals
  const [roleModalUser, setRoleModalUser] = useState<UserAccount | null>(null);
  const [statusModalUser, setStatusModalUser] = useState<UserAccount | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);

  const notify = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAdminNavigate = useCallback((page: AdminNavigationPage, params?: Record<string, string>) => {
    setAdminPage(page);
    if (params) {
      setAdminNavParams(params);
    }
  }, []);

  // Hydrate admin data
  const refreshAdminData = useCallback(async () => {
    try {
      const liveUsers = await adminApi.listUsers();
      if (liveUsers.items && liveUsers.items.length > 0) {
        setAllUsers(liveUsers.items.map(mapBackendUserToUserAccount));
      }
      const liveAudit = await adminApi.listAuditLogs();
      if (liveAudit.items && liveAudit.items.length > 0) {
        setAuditEvents(liveAudit.items.map(mapBackendAuditToAuditEvent));
      }
      const liveHealth = await adminApi.getSystemHealth();
      if (liveHealth) {
        setServiceHealth(mapBackendHealthToServiceHealth(liveHealth));
      }
    } catch (err) {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  const handleConfirmRoleChange = async (userId: string, newRole: UserRole, reason: string) => {
    try {
      await adminApi.changeUserRole(userId, newRole, reason);
      notify('success', `User role updated to ${newRole}`);
      refreshAdminData();
    } catch {
      storage.updateUserRole(userId, newRole);
      setAllUsers(storage.getUsers());
      notify('success', `User role updated to ${newRole} (local).`);
    }
    setRoleModalUser(null);
  };

  const handleConfirmStatusChange = async (userId: string, status: 'active' | 'deactivated', reason: string) => {
    try {
      await adminApi.changeUserStatus(userId, status, reason);
      notify('success', `User status changed to ${status}`);
      refreshAdminData();
    } catch {
      storage.updateUserStatus(userId, status);
      setAllUsers(storage.getUsers());
      notify('success', `User status changed to ${status} (local).`);
    }
    setStatusModalUser(null);
  };

  const handleAdminSignOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    setCurrentAdmin(null);
    setAdminPage('access_denied');
  };

  if (!currentAdmin || adminPage === 'access_denied') {
    return (
      <AccessDeniedPage
        onSwitchPortal={(portal) => {
          if (portal === 'admin') {
            setCurrentAdmin(storage.getAdminUser());
            setAdminPage('dashboard');
            refreshAdminData();
            notify('success', 'Authenticated as Administrator.');
          } else if (portal === 'teacher') {
            window.location.href = 'http://localhost:3002';
          } else {
            window.location.href = 'http://localhost:3001';
          }
        }}
      />
    );
  }

  return (
    <AdminLayout
      currentPage={adminPage}
      onNavigate={handleAdminNavigate}
      currentAdmin={currentAdmin}
      toasts={toasts}
      onDismissToast={handleDismissToast}
      onSwitchPortal={(portal) => {
        if (portal === 'teacher') window.location.href = 'http://localhost:3002';
        if (portal === 'student') window.location.href = 'http://localhost:3001';
      }}
      onSignOut={handleAdminSignOut}
      breadcrumbs={[{ label: 'Admin Portal', page: 'dashboard' }, { label: adminPage }]}
    >
      {adminPage === 'dashboard' && (
        <AdminDashboardPage
          users={allUsers}
          auditEvents={auditEvents}
          serviceHealth={serviceHealth}
          onNavigate={handleAdminNavigate}
        />
      )}

      {adminPage === 'users' && (
        <UserManagementPage
          users={allUsers}
          currentAdminId={currentAdmin.id}
          onNavigate={handleAdminNavigate}
          onRequestRoleChange={(u) => setRoleModalUser(u)}
          onRequestStatusChange={(u) => setStatusModalUser(u)}
        />
      )}

      {adminPage === 'user_details' && (
        <UserDetailsPage
          userId={adminNavParams.userId || allUsers[0]?.id || ''}
          users={allUsers}
          auditEvents={auditEvents}
          currentAdminId={currentAdmin.id}
          onNavigate={handleAdminNavigate}
          onRequestRoleChange={(u) => setRoleModalUser(u)}
          onRequestStatusChange={(u) => setStatusModalUser(u)}
        />
      )}

      {adminPage === 'roles' && (
        <RolesAccessPage
          users={allUsers}
          currentAdminId={currentAdmin.id}
          onConfirmRoleChange={handleConfirmRoleChange}
        />
      )}

      {adminPage === 'audit' && (
        <SecurityAuditLogPage
          auditEvents={auditEvents}
        />
      )}

      {adminPage === 'health' && (
        <SystemHealthPage
          serviceHealth={serviceHealth}
          onRefresh={refreshAdminData}
        />
      )}

      {adminPage === 'security' && (
        <AdminProfileSecurityPage
          currentAdmin={currentAdmin}
          onUpdateProfile={() => notify('success', 'Profile updated.')}
          onUpdatePassword={() => notify('success', 'Password updated.')}
          onNotify={notify}
        />
      )}

      {adminPage === 'oversight' && (
        <CourseOversightPage
          courses={courses}
          onNavigate={(page) => handleAdminNavigate(page as AdminNavigationPage)}
        />
      )}

      {/* Role Change Safeguard Modal */}
      {roleModalUser && (
        <ChangeRoleModal
          user={roleModalUser}
          isOpen={true}
          onClose={() => setRoleModalUser(null)}
          onConfirm={handleConfirmRoleChange}
          allUsers={allUsers}
          currentAdminId={currentAdmin.id}
        />
      )}

      {/* Deactivate Account Modal */}
      {statusModalUser && (
        <DeactivateAccountModal
          user={statusModalUser}
          isOpen={true}
          onClose={() => setStatusModalUser(null)}
          onConfirm={handleConfirmStatusChange}
          allUsers={allUsers}
          currentAdminId={currentAdmin.id}
        />
      )}
    </AdminLayout>
  );
}
