const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-full h-full border-4 border-accent-teal border-t-accent-cyan rounded-full animate-spin"></div>
        </div>
        <p className="text-neutral-300 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;