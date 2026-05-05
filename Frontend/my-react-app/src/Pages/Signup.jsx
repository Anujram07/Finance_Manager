import LoginPage from "../Components/UI/animated-characters-login-page";

export default function Signup({ setIsLoggedIn, setUserName }) {
  return (
    <LoginPage
      setIsLoggedIn={setIsLoggedIn}
      setUserName={setUserName}
      initialMode="signup"
    />
  );
}
