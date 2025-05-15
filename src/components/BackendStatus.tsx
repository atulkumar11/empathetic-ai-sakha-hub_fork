import React, { useEffect, useState } from 'react';
import { checkBackendStatus } from '@/services/api/connection';

const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkBackendStatus().then(setIsOnline);
  }, []);

  return (
    <div>
      Backend Status: {isOnline === null ? 'Checking...' : isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
};

export default BackendStatus;
