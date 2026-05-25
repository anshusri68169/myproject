import { FiAlertCircle, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

export default function Alert({ type = 'info', message, onClose }) {
  const icons = {
    info: FiInfo,
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertCircle,
  };

  const colors = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const Icon = icons[type];

  return (
    <div
      className={`flex items-center gap-3 p-4 border rounded-lg ${colors[type]} mb-4`}
    >
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg font-bold opacity-50 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
