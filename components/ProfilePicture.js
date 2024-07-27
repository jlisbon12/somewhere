import React, { useEffect, useState } from "react";
import { Image, ActivityIndicator, StyleSheet } from "react-native";

const Config = require("../config/config.json");

export default function ProfilePicture({ userId, width = 100, height = 100 }) {
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const response = await fetch(
          `${Config.apiurl}/api/users/profilePicture/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch image URL");
        }
        const data = await response.json();
        setImageUri(data.pictureUrl);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchImageUrl();
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={[styles.profilePicture, { width, height }]}
    />
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    borderRadius: 50,
  },
});
