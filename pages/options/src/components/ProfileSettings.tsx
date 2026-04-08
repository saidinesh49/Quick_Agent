import { useState, useEffect } from 'react';
import { userStore, DEFAULT_USER_PROFILE, type UserProfile } from '@extension/storage/lib/profile/user';

interface ProfileSettingsProps {
  isDarkMode?: boolean;
}

type FieldDef = { key: keyof UserProfile; label: string; placeholder?: string; type?: string };

const PERSONAL_FIELDS: FieldDef[] = [
  { key: 'firstName', label: 'First Name', placeholder: 'John' },
  { key: 'lastName', label: 'Last Name', placeholder: 'Doe' },
  { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
  { key: 'phone', label: 'Phone', placeholder: '+1 555 000 0000', type: 'tel' },
  { key: 'dateOfBirth', label: 'Date of Birth', placeholder: 'YYYY-MM-DD' },
];

const ADDRESS_FIELDS: FieldDef[] = [
  { key: 'addressLine1', label: 'Address Line 1', placeholder: '123 Main St' },
  { key: 'addressLine2', label: 'Address Line 2 (optional)', placeholder: 'Apt 4B' },
  { key: 'city', label: 'City', placeholder: 'San Francisco' },
  { key: 'state', label: 'State / Province', placeholder: 'CA' },
  { key: 'zipCode', label: 'ZIP / Postal Code', placeholder: '94105' },
  { key: 'country', label: 'Country', placeholder: 'United States' },
];

const PROFESSIONAL_FIELDS: FieldDef[] = [
  { key: 'jobTitle', label: 'Job Title', placeholder: 'Software Engineer' },
  { key: 'company', label: 'Company', placeholder: 'Acme Corp' },
  { key: 'yearsOfExperience', label: 'Years of Experience', placeholder: '3' },
  { key: 'skills', label: 'Skills', placeholder: 'Python, React, TypeScript' },
  { key: 'linkedIn', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
  { key: 'website', label: 'Website / Portfolio', placeholder: 'https://myportfolio.com' },
];

const EDUCATION_FIELDS: FieldDef[] = [
  { key: 'highestDegree', label: 'Highest Degree', placeholder: "Bachelor's" },
  { key: 'fieldOfStudy', label: 'Field of Study', placeholder: 'Computer Science' },
  { key: 'university', label: 'University / College', placeholder: 'MIT' },
  { key: 'graduationYear', label: 'Graduation Year', placeholder: '2023' },
];

export const ProfileSettings = ({ isDarkMode = false }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    userStore.getProfile().then(setProfile);
  }, []);

  const handleChange = (key: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await userStore.updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = async () => {
    const cleared = { ...DEFAULT_USER_PROFILE, userId: profile.userId };
    setProfile(cleared);
    await userStore.updateProfile(cleared);
  };

  const inputCls = `w-full rounded-md border px-3 py-2 text-sm ${
    isDarkMode
      ? 'border-slate-600 bg-slate-700 text-gray-200 placeholder-slate-400'
      : 'border-gray-300 bg-white text-gray-700 placeholder-gray-400'
  }`;

  const labelCls = `mb-1 block text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`;

  const renderSection = (title: string, fields: FieldDef[]) => (
    <div className="mb-6">
      <h3 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className={key === 'addressLine1' || key === 'skills' ? 'col-span-2' : ''}>
            <label htmlFor={key} className={labelCls}>
              {label}
            </label>
            <input
              id={key}
              type={type ?? 'text'}
              value={profile[key] as string}
              placeholder={placeholder}
              onChange={e => handleChange(key, e.target.value)}
              className={inputCls}
              autoComplete="off"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 text-left shadow-sm`}>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              My Profile
            </h2>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Stored locally only — never sent to any server. Used to auto-fill forms when you ask the agent to fill in your details.
            </p>
          </div>
        </div>

        <div className={`my-4 rounded-md px-4 py-3 text-sm ${isDarkMode ? 'bg-slate-700/60 text-yellow-300' : 'bg-yellow-50 text-yellow-800'}`}>
          <strong>Privacy:</strong> All data is saved to <code>chrome.storage.local</code> on your device. It is never uploaded or shared.
        </div>

        {renderSection('Personal Information', PERSONAL_FIELDS)}
        {renderSection('Address', ADDRESS_FIELDS)}
        {renderSection('Professional', PROFESSIONAL_FIELDS)}
        {renderSection('Education', EDUCATION_FIELDS)}

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700 active:bg-sky-800">
            Save Profile
          </button>
          <button
            onClick={handleClear}
            className={`rounded-md border px-5 py-2 text-sm font-medium ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            Clear All
          </button>
          {saved && (
            <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              Saved!
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
