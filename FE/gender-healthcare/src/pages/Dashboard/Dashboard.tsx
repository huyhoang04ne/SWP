import Footer from "../../components/Footer";
import Header from "../../components/header";
import Navbar from "../../components/navbar";

const Dashboard: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-purple-800">Dashboard</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
