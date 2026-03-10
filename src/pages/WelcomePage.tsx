import { useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/WelcomeScreen";

type User = { id: number; name: string } | null;
type WelcomeProps = { user: User };

export default function WelcomePage({ user }: WelcomeProps) {
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
