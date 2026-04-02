const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {children}
      </div>

    </div>
  );
};

export default Layout;