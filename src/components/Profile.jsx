import React, { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa"; // Icon for points

const categories = [
  { name: "Recycle Plastics", description: "Properly dispose of plastic waste to reduce pollution." },
  { name: "Plant Trees", description: "Help fight climate change by planting trees in your area." },
  { name: "Save Water", description: "Reduce water wastage by using water responsibly." },
  { name: "Reduce Food Waste", description: "Minimize food wastage by consuming responsibly." },
  { name: "Use Renewable Energy", description: "Switch to solar or wind energy to reduce carbon footprint." },
  { name: "Eco-friendly Transport", description: "Use bicycles, public transport, or carpooling to save fuel." },
];

const Profile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    points: 100,
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [transactions, setTransactions] = useState([
    { id: 1, type: "Earned", amount: "+5", description: "Uploaded sustainability photo" },
    { id: 2, type: "Redeemed", amount: "-25", description: "Redeemed points for rewards" },
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Track the animation state for points

  // Open modal for selected category
  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Function to animate the points when they increase
  const animatePoints = (newPoints) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setUser((prev) => ({ ...prev, points: newPoints }));
    }, 1000); // Animation duration
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setUploadedImage(null);
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle image upload & send to backend
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedCategory) return;

    setUploadedImage(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("category", selectedCategory.name);

    try {
      const response = await axios.post("http://localhost:5000/api/getPoints", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);

      const newPoints = response.data.pointsAwarded;
      animatePoints(user.points + newPoints); // Trigger the animation for points

      setUser((prev) => ({ ...prev, points: prev.points + newPoints }));

      const isCategoryCorrect = newPoints === 10;  // If points awarded is 10, category is correct

      setTransactions((prev) => [
          {
              id: prev.length + 1,
              type: isCategoryCorrect ? "Earned" : "Lost",
              amount: isCategoryCorrect ? `+${newPoints}` : `-${newPoints}`,
              description: isCategoryCorrect
                  ? `Uploaded ${selectedCategory.name} photo`
                  : `Uploaded ${selectedCategory.name} photo - Wrong category!`,
              color: isCategoryCorrect ? "green" : "red",  // Set color based on correctness
          },
          ...prev,
      ]);
      
      
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="ml-[250px] p-6">
      {/* Navbar */}
      <nav className="bg-white shadow-md flex justify-between items-center px-6 py-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800">Sustainability Section</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaStar className={`text-yellow-500 ${isAnimating ? "animate-pulse" : ""}`} /> {/* Icon with animation */}
            <span className="text-lg font-semibold text-gray-700">Points: {user.points}</span>
          </div>
          <div className="relative">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
                <button
                  onClick={() => alert("Edit Profile Clicked")}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Upload Section */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Sustainability Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-200"
            >
              <span className="text-gray-800">{category.name}</span>
              <button
                onClick={() => openModal(category)}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              >
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Redeem Points & Transactions</h3>
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li
              key={tx.id}
              className={`p-3 rounded-lg ${
                tx.type === "Earned" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {tx.amount} - {tx.description}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Uploading Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 float-right">✖</button>
            <h3 className="text-lg font-semibold text-gray-800">{selectedCategory.name}</h3>
            <p className="text-gray-600 mb-4">{selectedCategory.description}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full border rounded-md p-2 mb-4"
            />
            {uploadedImage && <img src={uploadedImage} alt="Uploaded Preview" className="w-full rounded-lg mb-4" />}

            {loading && <p className="text-blue-500">Verifying image...</p>}

          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;