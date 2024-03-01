import { AppDisplay } from "../App";

interface StartPageProps {
    setDisplay: (display: AppDisplay) => void;
  }

function StartPage({ setDisplay }: StartPageProps) {
  return (
    <div>
      <h1>Welcome to the start page</h1>
      <button onClick={() => setDisplay(AppDisplay.REGISTER_PAGE)}>
        Register
      </button>
      <button onClick={() => setDisplay(AppDisplay.LOGIN_PAGE)}>Login</button>
    </div>
  );
}

export default StartPage;
