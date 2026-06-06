import { app } from './index';

const port = process.env.PORT || 4821;

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server is running on port ${port} and listening on 0.0.0.0`);
});
