import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

// Interface for user profile configuration
export interface UserProfile {
  userId: string;
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  // Address
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  // Professional
  jobTitle: string;
  company: string;
  yearsOfExperience: string;
  skills: string;
  linkedIn: string;
  website: string;
  // Education
  highestDegree: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
}

export type UserStorage = BaseStorage<UserProfile> & {
  createProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  getProfile: () => Promise<UserProfile>;
  getUserId: () => Promise<string>;
  hasFilledProfile: () => Promise<boolean>;
};

// Default profile (all empty except userId)
export const DEFAULT_USER_PROFILE: UserProfile = {
  userId: 'unknown',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  jobTitle: '',
  company: '',
  yearsOfExperience: '',
  skills: '',
  linkedIn: '',
  website: '',
  highestDegree: '',
  fieldOfStudy: '',
  university: '',
  graduationYear: '',
};

const storage = createStorage<UserProfile>('user-profile', DEFAULT_USER_PROFILE, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const userStore: UserStorage = {
  ...storage,

  async createProfile(profile: Partial<UserProfile>) {
    const fullProfile = {
      ...DEFAULT_USER_PROFILE,
      ...profile,
    };
    await storage.set(fullProfile);
  },

  async updateProfile(profile: Partial<UserProfile>) {
    const currentProfile = (await storage.get()) || DEFAULT_USER_PROFILE;
    await storage.set({
      ...currentProfile,
      ...profile,
    });
  },

  async getProfile() {
    const profile = await storage.get();
    return { ...DEFAULT_USER_PROFILE, ...(profile || {}) };
  },

  async getUserId() {
    const profile = await this.getProfile();
    if (!profile.userId || profile.userId === 'unknown') {
      const newUserId = crypto.randomUUID();
      await this.updateProfile({ userId: newUserId });
      return newUserId;
    }
    return profile.userId;
  },

  async hasFilledProfile() {
    const profile = await this.getProfile();
    return !!(profile.firstName || profile.email || profile.phone);
  },
};
