const REQUIRED_ENV_VARS = ['DATABASE_URL', 'SESSION_SECRET', 'CORS_ORIGIN'] as const;

const checkEnvVariables = (): void => {
    const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('Missing environment variables: ' + missingVars.join(', '));
        process.exit(1);
    }
};

checkEnvVariables();