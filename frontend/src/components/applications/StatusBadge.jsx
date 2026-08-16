// src/components/applications/StatusBadge.jsx

import { APPLICATION_STATUSES } from '../../utils/constants';

export default function StatusBadge({ status }) {
  const config = APPLICATION_STATUSES[status] || { label: status, color: 'gray' };
  return (
    <span className={`badge badge--${config.color}`}>
      {config.label}
    </span>
  );
}
