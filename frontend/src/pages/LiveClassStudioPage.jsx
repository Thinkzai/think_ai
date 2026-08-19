import { useNavigate, useParams } from "react-router-dom";
import LiveClassStudio from "../components/LiveClassStudio";

function LiveClassStudioPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  return (
    <LiveClassStudio
      sessionId={sessionId}
      onLeave={() => navigate(-1)}
    />
  );
}

export default LiveClassStudioPage;
