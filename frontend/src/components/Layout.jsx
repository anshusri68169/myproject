export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2026 QuickLift. All rights reserved.</p>
      </footer>
    </div>
  );
}
