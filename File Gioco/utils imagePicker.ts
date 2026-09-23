import * as ImagePicker from "expo-image-picker";

export async function pickImage(): Promise<string | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    if (!perm.canAskAgain) {
      // Return a special sentinel so UI can offer "Open Settings"
      return null;
    }
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    base64: true,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const a = result.assets[0];
  if (a.base64) {
    // Persistable across app restarts
    return `data:image/jpeg;base64,${a.base64}`;
  }
  return a.uri;
}

export async function checkGalleryPermission() {
  return await ImagePicker.getMediaLibraryPermissionsAsync();
}
