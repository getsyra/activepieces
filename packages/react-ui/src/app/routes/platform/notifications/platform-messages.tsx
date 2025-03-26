import { notificationHooks } from './hooks/notifictions-hooks';
import PlatformAlert from './platform-alert';

export const PlatformMessages = () => {
  return (
    <div className="space-y-4">
      <PlatformAlert
        title="You're up to date"
        description="You are using the latest version"
        type="default"
      />
    </div>
  );
};
