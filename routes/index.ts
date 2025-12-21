export interface IRoute {
  id: string;
  p: string;
  private: boolean;
  title: string;
}

export interface IRouter {
  [key: string]: IRoute;
}

const Router: IRouter = {
  index: { id: "index", p: "/", private: true, title: "Home" },
  signIn: { id: "signIn", p: "/sign-in", private: false, title: "Sign In" },
  signUp: { id: "signUp", p: "/sign-up", private: false, title: "Sign Up" },
};

export default Router;
