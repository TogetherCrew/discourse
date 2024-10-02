export const airflowConfig = (): Record<string, unknown> => ({
  airflow: {
    username: process.env.AIRFLOW_USERNAME,
    password: process.env.AIRFLOW_PASSWORD,
    baseUrl: process.env.AIRFLOW_BASE_URL,
  },
});
