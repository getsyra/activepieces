import { t } from 'i18next';
import {
  Server,
  Shield,
  Users,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useShowPlatformAdminDashboard } from '@/hooks/authorization-hooks';
import { flagsHooks } from '@/hooks/flags-hooks';
import { platformHooks } from '@/hooks/platform-hooks';
import { ApEdition, ApFlagId } from '@activepieces/shared';

import { AllowOnlyLoggedInUserOnlyGuard } from './allow-logged-in-user-only-guard';
import { SidebarComponent, SidebarItem } from './sidebar';

type PlatformAdminContainerProps = {
  children: React.ReactNode;
};

export function PlatformAdminContainer({
  children,
}: PlatformAdminContainerProps) {
  const [setupOpen, setSetupOpen] = useState(false);
  const [infrastructureOpen, setInfrastructureOpen] = useState(false);
  const { data: edition } = flagsHooks.useFlag<ApEdition>(ApFlagId.EDITION);

  const { data: showPlatformDemo } = flagsHooks.useFlag<boolean>(
    ApFlagId.SHOW_PLATFORM_DEMO,
  );

  const showPlatformAdminDashboard = useShowPlatformAdminDashboard();
  const isLocked = (locked: boolean) => locked || (showPlatformDemo ?? false);
  const items: SidebarItem[] = [
    {
      type: 'link',
      to: '/platform/users',
      label: t('Users'),
      icon: Users,
      isSubItem: false,
    },
    {
      type: 'group',
      label: t('Setup'),
      icon: Wrench,
      defaultOpen: false,
      open: setupOpen,
      setOpen: setSetupOpen,
      isActive: (pathname: string) => pathname.includes('/setup'),
      items: [
        {
          type: 'link',
          to: '/platform/setup/ai',
          label: t('AI'),
          isSubItem: true,
        },
        {
          type: 'link',
          to: '/platform/setup/pieces',
          label: t('Pieces'),
          isSubItem: true,
        },
      ],
    },
  ];
  if (edition === ApEdition.CLOUD && !showPlatformDemo) {
    const setupGroup = items.find(
      (item) => item.type === 'group' && item.label === t('Setup'),
    );
    if (setupGroup && setupGroup.type === 'group') {
      setupGroup.items.push({
        type: 'link',
        to: '/platform/setup/billing',
        label: t('Billing'),
        isSubItem: true,
      });
    }
  }
  return (
    <AllowOnlyLoggedInUserOnlyGuard>
      {showPlatformAdminDashboard ? (
        <SidebarComponent items={items}>{children}</SidebarComponent>
      ) : (
        <Navigate to="/" />
      )}
    </AllowOnlyLoggedInUserOnlyGuard>
  );
}
