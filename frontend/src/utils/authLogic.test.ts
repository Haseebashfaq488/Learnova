import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  authApi,
  mapUserResponseToStudentUser,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from '../services/api/authApi.ts';
import type { UserResponse } from '../services/api/authApi.ts';
import { storage } from '../services/storageService.ts';

// Mock localStorage for node test environment if not present
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] || null,
    length: 0,
  } as any;
}

describe('Authentication & Session Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    authApi.setAccessToken(null);
    authApi.setStoredUser(null);
  });

  test('setAccessToken persists token to localStorage and recovers it', () => {
    const testToken = 'mock-jwt-token-12345';
    authApi.setAccessToken(testToken);

    assert.equal(authApi.getAccessToken(), testToken);
    assert.equal(localStorage.getItem(TOKEN_STORAGE_KEY), testToken);

    // Clear memory token and verify recovery from localStorage
    (authApi as any).accessToken = null;
    assert.equal(authApi.getAccessToken(), testToken);
  });

  test('setStoredUser serializes user profile to localStorage', () => {
    const mockUser: UserResponse = {
      id: 'usr-123',
      email: 'student@learnova.edu',
      full_name: 'Alex Rivera',
      role: 'student',
      is_active: true,
      created_at: '2026-11-13T10:00:00Z',
      profile: {
        id: 'prof-123',
        user_id: 'usr-123',
        department: 'Computer Science',
        created_at: '2026-11-13T10:00:00Z',
        updated_at: '2026-11-13T10:00:00Z',
      },
    };

    authApi.setStoredUser(mockUser);
    const retrieved = authApi.getStoredUser();

    assert.ok(retrieved);
    assert.equal(retrieved.id, mockUser.id);
    assert.equal(retrieved.email, mockUser.email);
    assert.equal(retrieved.role, 'student');
  });

  test('portal mode persistence preserves active portal between reloads', () => {
    storage.setPersistedPortalMode('teacher');
    assert.equal(storage.getPersistedPortalMode(), 'teacher');

    storage.setPersistedPortalMode('admin');
    assert.equal(storage.getPersistedPortalMode(), 'admin');

    storage.setPersistedPortalMode('student');
    assert.equal(storage.getPersistedPortalMode(), 'student');
  });

  test('clearSessionCredentials cleans up all authentication and portal artifacts', () => {
    authApi.setAccessToken('sample-token');
    authApi.setStoredUser({ id: 'u1', email: 'u@test.com', full_name: 'U', role: 'student', is_active: true, created_at: '' });
    storage.setPersistedPortalMode('teacher');

    storage.clearSessionCredentials();

    assert.equal(localStorage.getItem(TOKEN_STORAGE_KEY), null);
    assert.equal(localStorage.getItem(USER_STORAGE_KEY), null);
    assert.equal(storage.getPersistedPortalMode(), null);
  });

  test('mapUserResponseToStudentUser maps backend user to student shape', () => {
    const user: UserResponse = {
      id: 'usr-999',
      email: 'jordan.lee@university.edu',
      full_name: 'Jordan Lee',
      role: 'student',
      is_active: true,
      created_at: '2026-09-01T08:30:00Z',
      profile: {
        id: 'prof-999',
        user_id: 'usr-999',
        bio: 'Math and computing scholar',
        created_at: '2026-09-01T08:30:00Z',
        updated_at: '2026-09-01T08:30:00Z',
      },
    };

    const student = mapUserResponseToStudentUser(user);
    assert.equal(student.id, 'usr-999');
    assert.equal(student.name, 'Jordan Lee');
    assert.equal(student.avatar, 'JL');
    assert.equal(student.bio, 'Math and computing scholar');
    assert.equal(student.joinDate, '2026-09-01');
  });

  test('mapUserResponseToStudentUser handles Google avatar URLs cleanly', () => {
    const googleUser: UserResponse = {
      id: 'usr-google-1',
      email: 'alex.rivera@gmail.com',
      full_name: 'Alex Rivera',
      role: 'student',
      is_active: true,
      created_at: '2026-11-14T09:00:00Z',
      profile: {
        id: 'prof-g1',
        user_id: 'usr-google-1',
        avatar_url: 'https://lh3.googleusercontent.com/a/custom-avatar',
        created_at: '2026-11-14T09:00:00Z',
        updated_at: '2026-11-14T09:00:00Z',
      },
    };

    const student = mapUserResponseToStudentUser(googleUser);
    assert.equal(student.id, 'usr-google-1');
    assert.equal(student.name, 'Alex Rivera');
    assert.equal(student.avatar, 'https://lh3.googleusercontent.com/a/custom-avatar');
  });
});
