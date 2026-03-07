import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function HomeScreen() {
  const [videoName, setVideoName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    console.log("Opening video picker...");

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Need access to media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
    });

    console.log("Picker result:", result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "video.mp4";

      console.log("Selected video:", uri);

      setVideoName(filename);

      uploadVideo(uri, filename);
    }
  };

  const uploadVideo = async (uri: string, filename: string) => {
    try {
      console.log("Starting upload...");

      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();

      console.log("Blob created");

      const storageRef = ref(storage, `golfVideos/${filename}`);

      console.log("Uploading to Firebase...");

      await uploadBytes(storageRef, blob);

      console.log("Upload complete");

      const downloadURL = await getDownloadURL(storageRef);

      console.log("Download URL:", downloadURL);

      Alert.alert("Upload Complete!", downloadURL);
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      Alert.alert("Upload failed. Check terminal.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ParVision AI Golf Coach</Text>

      <Button title="Upload Golf Video" onPress={pickVideo} />

      {uploading && <Text>Uploading video...</Text>}

      {videoName && <Text style={styles.videoText}>Selected: {videoName}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  videoText: {
    marginTop: 20,
    fontSize: 16,
  },
});