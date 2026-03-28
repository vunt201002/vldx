import Link from 'next/link';

function Error({ statusCode, globalTheme: _globalTheme }) {
  const errorMessages = {
    404: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    },
    500: {
      title: 'Server Error',
      description: 'Something went wrong on our end. Please try again later.'
    },
    default: {
      title: 'An Error Occurred',
      description: 'We encountered an unexpected error.'
    }
  };

  const error = errorMessages[statusCode] || errorMessages.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Error Code */}
        <h1 className="mb-4 text-6xl font-bold text-gray-900">
          {statusCode || 'Error'}
        </h1>

        {/* Error Title */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          {error.title}
        </h2>

        {/* Error Description */}
        <p className="mb-8 text-lg text-gray-600">{error.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-sandstone px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-concrete"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-lg border-2 border-sandstone bg-white px-6 py-3 text-base font-semibold text-sandstone transition-colors hover:bg-sand"
          >
            Try Again
          </button>
        </div>

        {/* Contact Support */}
        {statusCode === 500 && (
          <p className="mt-8 text-sm text-gray-500">
            If this problem persists, please{' '}
            <a href="mailto:support@vlxd.com" className="text-sandstone hover:underline">
              contact support
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
