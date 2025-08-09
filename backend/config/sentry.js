const Sentry = require('@sentry/node');
const { CaptureConsole } = require('@sentry/integrations');

const initSentry = (app) => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        new CaptureConsole({
          levels: ['error', 'warn']
        })
      ],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers?.authorization;
          delete event.request.headers?.cookie;
        }
        
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Sentry Event:', event);
          return null;
        }
        
        return event;
      }
    });

    // Request handler
    app.use(Sentry.Handlers.requestHandler());
    
    // Tracing handler
    app.use(Sentry.Handlers.tracingHandler());
    
    console.log('Sentry initialized');
  } else {
    console.log('Sentry DSN not provided, error tracking disabled');
  }
};

const sentryErrorHandler = () => {
  if (process.env.SENTRY_DSN) {
    return Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Capture errors with status 500 or unhandled
        if (!error.status || error.status >= 500) {
          return true;
        }
        return false;
      }
    });
  }
  return (err, req, res, next) => next(err);
};

module.exports = {
  initSentry,
  sentryErrorHandler,
  Sentry
};