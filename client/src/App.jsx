import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://ton-backend.onrender.com/player/VOTRE_TAG");
        setStats(response.data);
      } catch (err) {
        console.error("Erreur de récupération :", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // Toutes les 15 secondes
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="text-white">Chargement des stats...</div>;

  return (
    <div className="p-4 bg-black text-white rounded-xl">
      <h1 className="text-xl font-bold">{stats.name}</h1>
      <p>Trophées : {stats.trophies}</p>
      <p>Niveau : {stats.expLevel}</p>
      <p>Victoire en 3v3 : {stats['3vs3Victories']}</p>
    </div>
  );
}

export default App;