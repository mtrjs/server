interface User {
  account: string;
  password: string;
  user_id?: string;
}

interface Application {
  name: string;
  type: number;
  env: string;
}
