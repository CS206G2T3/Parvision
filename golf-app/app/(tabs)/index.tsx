import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function HomeScreen() {
  const [videoName, setVideoName] = useState<string | null>(null);

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "We need access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setVideoName(uri.split("/").pop() || "Video selected");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ParVision AI Golf Coach</Text>
      <Button title="Upload Golf Video" onPress={pickVideo} />
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
