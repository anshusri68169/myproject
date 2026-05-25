export default function Badge({ label, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-blue-600 text-white',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
