export type TRes = {
  [key: string]: any;
  _details: {
    status: number;
    ok: boolean;
    statusText: string;
    url: string;
    type: string;
    redirected: boolean;
  };
};
