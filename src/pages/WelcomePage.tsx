import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";

export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <WelcomeScreen
      onContinue={({ lang }) => {
        console.log("language:", lang);
        navigate("/learn");
      }}
    />
  );
}
