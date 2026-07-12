import { useNavigate } from 'react-router-dom';
import { SystemModulePage } from './SystemModulePage';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <SystemModulePage
      title="Profile"
      description="Manage profile details, password, and profile photo for the signed-in user."
      icon="User"
      actions={[
        { label: 'Edit Profile', variant: 'primary', icon: 'Edit', onClick: () => navigate('/profile/edit') },
        { label: 'Change Password', icon: 'Lock', onClick: () => navigate('/profile/change-password') },
      ]}
      stats={[
        { label: 'Role', value: 'Admin', color: '#4F46E5', bg: '#EEF2FF', icon: 'Shield' },
        { label: 'Actions', value: '142', color: '#10B981', bg: '#ECFDF5', icon: 'Activity' },
        { label: 'Assigned Assets', value: '4', color: '#06B6D4', bg: '#ECFEFF', icon: 'Package' },
        { label: 'Security', value: 'Good', color: '#F59E0B', bg: '#FFFBEB', icon: 'Lock' },
      ]}
      features={['Edit profile', 'Change password', 'Profile photo', 'Assigned asset summary']}
      workflow={['View profile', 'Update details', 'Confirm password', 'Save changes']}
      records={[
        { id: 'USR-001', title: 'John Doe', subtitle: 'Asset Manager · Administration', meta: ['john@assetflow.test', '+1 555 0199', 'Admin'], status: 'Active' },
      ]}
    />
  );
}
