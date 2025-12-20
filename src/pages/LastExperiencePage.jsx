import React from "react";
import { useNavigate } from "react-router-dom";
import LastExperienceForm from "../components/LastExperienceForm";
import lastExperienceApi from "../api/lastExperienceApi";

const LastExperiencePage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    try {
      await lastExperienceApi.saveLastExperience(data);
      alert("Last Experience details saved successfully!");
      navigate("/completed");
    } catch (error) {
      console.error("Error saving last experience:", error);
      alert("Error saving details");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-5xl w-full">
        <LastExperienceForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default LastExperiencePage;
